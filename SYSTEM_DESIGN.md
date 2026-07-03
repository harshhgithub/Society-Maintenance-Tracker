# System Design Write-Up — Society Maintenance Tracker

---

## Overview

The Society Maintenance Tracker is a full-stack web application built to streamline complaint management in apartment societies. The system supports two roles — residents who raise complaints and admins who manage them. The core design decisions revolve around four areas: complaint history modelling, overdue detection, photo handling, and notification flow.

---

## 1. Complaint History Model

The central challenge in this system is recording every status change a complaint goes through without losing any information. The complaint lifecycle moves through three states: Open, In Progress, and Resolved. Each transition needs to be recorded with who made the change, when it happened, and optionally why.

The design decision was to embed the history as an array inside the Complaint document in MongoDB. Each element in the history array is an object containing the old status, new status, a note, the actor who made the change, and a timestamp.

```json
"history": [
  {
    "oldStatus": "open",
    "newStatus": "in_progress",
    "note": "Plumber has been assigned",
    "changedBy": "admin_id",
    "changedAt": "2024-01-15T10:30:00Z"
  }
]
```

This approach was chosen over a separate history collection for two reasons. First, a complaint and its history are always fetched together — a resident viewing their complaint always wants to see its full trail. Embedding avoids a separate database query. Second, MongoDB's document model handles this naturally; the history array grows with each status change and stays co-located with the complaint it belongs to.

When the admin updates a status, the backend pushes a new entry into this array and updates the current status field on the complaint document in a single operation. Once a complaint is marked Resolved, the status buttons are hidden on the frontend and no further changes are allowed, effectively closing the complaint.

---

## 2. Overdue Detection

Overdue detection answers the question: which complaints have been sitting open for too long? The system defines a configurable threshold (default 7 days) and automatically flags complaints that exceed it.

The implementation uses a cron job that runs every night at midnight using the node-cron library. The job queries MongoDB for complaints where the status is not resolved and the creation date is older than the threshold. It then sets the isOverdue flag to true on all matching documents in a single updateMany operation.

```
Every night at 00:00 →
  Find complaints where status != resolved AND createdAt < (today - 7 days)
  Set isOverdue = true on all matches
```

The threshold is kept as a named constant at the top of the cron file so it can be changed in one place without touching any other logic. When overdue complaints are fetched by the admin, the query sorts by isOverdue descending, which surfaces flagged complaints at the top of the list automatically. When a complaint is resolved, the isOverdue flag is reset to false so it no longer appears in the overdue section.

This design keeps overdue detection entirely server-side and decoupled from the complaint update flow. It runs independently every night and requires no manual triggering.

---

## 3. Photo Handling

Residents can optionally attach a photo when raising a complaint to provide visual evidence of the issue. The photo handling pipeline involves three components: Multer, Cloudinary, and MongoDB.

When a resident submits a complaint with a photo, the request is intercepted by Multer middleware before reaching the controller. Multer saves the file temporarily to a local uploads/ folder on the server and attaches the file path to the request object.

The controller then picks up this temporary file path and uploads it directly to Cloudinary using their Node.js SDK. Cloudinary processes and stores the image in a dedicated folder called society_complaints and returns a permanent secure URL.

```
Resident uploads photo
  → Multer saves to uploads/ (temporary)
  → Controller uploads to Cloudinary
  → Cloudinary returns secure_url
  → URL saved in MongoDB complaint document
  → Temporary file deleted from server
```

After the Cloudinary upload succeeds, the temporary file is deleted from the server using Node's built-in fs.unlinkSync to keep the server storage clean. Only the Cloudinary URL is persisted in the complaint document. This means the backend never permanently stores images itself — it delegates that responsibility to Cloudinary's CDN, which also handles fast image delivery to the frontend.

The photo field is optional. If no photo is attached, the photoUrl field is stored as an empty string and the frontend simply does not render an image for that complaint.

---

## 4. Notification Flow

The system sends email notifications to residents in two situations: when their complaint status changes, and when an admin posts an important notice.

Email is handled by Resend, a transactional email API that sends emails over HTTPS. This was chosen over Nodemailer with Gmail SMTP because the production hosting platform (Render) blocks outgoing SMTP ports (465/587) on its free tier. Resend operates entirely over HTTPS port 443 which is never blocked, making it reliable across all hosting environments. The email utility is a simple async function that wraps the Resend SDK and is imported wherever notifications are needed.

**Status Change Notification**

When an admin updates a complaint's status, the backend fetches the complaint with the resident's user details populated (including their email). After saving the status change and logging it to history, it immediately sends an email to the resident's address with the new status and any note the admin added.

```
Admin updates status
  → History entry saved
  → Complaint status updated
  → Email sent to resident with new status and note
```

**Important Notice Notification**

When an admin posts a notice marked as important, the backend fetches all users with the role of resident from the database and sends an email to each one informing them of the new notice. This is a broadcast operation — every resident gets notified.

```
Admin posts important notice
  → Notice saved to database
  → All residents fetched
  → Email sent to each resident via Resend API
```

Non-important notices are posted to the notice board without triggering any emails. Important notices are additionally pinned to the top of the notice board using the isPinned flag, sorted descending so pinned notices always appear first regardless of when they were posted.

The notification system is intentionally kept simple and synchronous within the request cycle. For a production system with thousands of residents, this would be replaced with a message queue, but for the scope of this project the direct approach is reliable and straightforward.

---

## Summary

The four design decisions work together to deliver a complete complaint management system. Embedded history gives instant access to the full audit trail. The nightly cron keeps overdue detection automatic and configurable. The Multer-to-Cloudinary pipeline keeps the server stateless with respect to images. And the Resend API integration keeps residents informed at every step while remaining compatible with all hosting platforms.
