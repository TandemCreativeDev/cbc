# Editing the site with the admin panel

The band edits the site at `https://clarksbowlingclub.com/admin`. It replaces the Google Sheet.

## Signing in

Sign in with your own `@clarksbowlingclub.com` address and password. Every account can edit all the content. Ask a developer to add a new member: a developer creates the account under **Users**.

## What you can edit

| Menu | What it controls | Notes |
| --- | --- | --- |
| About page | The text of `/about` | Title and content, in English and French |
| Tour page | The intro text of `/tour` | Title and content, in English and French |
| Tour dates | The gigs on `/tour` | Date and venue are required. Links must start with `https://`. The site works out which dates are upcoming and which are past |
| Music items | The players on `/music` | Pick the type (YouTube, Spotify, Bandcamp) and paste the player link from that site. The category is written in both languages. Drag the rows to change their order |
| Lyrics | The songs on `/lyrics` | A song shows on the site only when its status is `published` and it has lyrics. Keep unfinished songs as `draft`. Drag the rows to change their order |
| Media | Images | Not used on a page yet |

## Switching language

Pages with two languages have an `en` / `fr` switch at the top right of the edit form. Fill in both. If the French is empty, the site shows the English instead (lyrics excepted: the French lyrics tab can stay empty).

## When changes appear

Saving or deleting a document refreshes the site straight away. If a change does not appear after a minute, reload the page without the cache (Cmd/Ctrl + Shift + R) before asking a developer.

## If something goes wrong

A field that is invalid shows a red message under it and the document is not saved. Fix it and save again. For anything else, send the address of the page and what you did to a developer.
