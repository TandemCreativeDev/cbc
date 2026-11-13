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
| Calendar doors | The 24 doors of `/calendrier` | One entry per door: the day (1 to 24), a title, a note and the MP3 |
| Calendar settings | The look and behaviour of `/calendrier` | Colours, fonts, texts, images, year and opening hour |
| Media | Images | Used for the calendar's background, share picture and door pictures |

## The advent calendar (`/calendrier`)

### Upload or replace a demo

1. Open **Calendar doors** and press **Create new**, or open the door you want to change.
2. Choose the **Day** (1 to 24), type the **Title** and an optional **Note**, then drop the MP3 on the upload box. Fill the title and note in both languages with the `en` / `fr` switch.
3. Press **Save**. To replace a demo, open its door, remove the old file with the cross, drop the new MP3 and save. Visitors hear the new one straight away.

A demo is private: visitors can only play it on or after its day, and no link to the file works before that. Each door also has an optional **Color** and **Image**; leave them empty for the default look.

### Change a title or any text

Open **Calendar settings**, go to **Texts**, switch to `fr` or `en` and type. A field left empty shows the grey default. `{year}` in the date range and footer becomes the year set under **Behaviour**.

### Colours, fonts, images

- **Colors** has the five named colours. Each has a picker and a text box; the text must be a colour such as `#a23c20`, otherwise the form refuses to save. Every orange, brown and cream on the page follows these five, so change one and the whole page follows.
- **Door colors** is the repeating list of door colours. Leave it empty for the defaults.
- **Fonts** has three lists: the title, the second title line and the body text. Pick a font and save.
- **Images** takes an optional page background and a share picture used when the link is posted on social networks. Upload them in **Media** first.

### Hide the calendar, change the year or the hour

Under **Behaviour**: **Visible** starts unticked, so visitors get a holding page until you tick it and save; you stay able to see everything either way. **Year** and **Opens at hour** (Paris time) decide when each door opens. **After 24 December** chooses between keeping every door open and showing the holding page.

### Check the preview

Sign in at `/admin`, then open `/calendrier` in the same browser. A **Mode test** button appears: press it to open all 24 doors and play any demo, whatever the date.

## Switching language

Pages with two languages have an `en` / `fr` switch at the top right of the edit form. Fill in both. If the French is empty, the site shows the English instead (lyrics excepted: the French lyrics tab can stay empty).

## When changes appear

Saving or deleting a document refreshes the site straight away. If a change does not appear after a minute, reload the page without the cache (Cmd/Ctrl + Shift + R) before asking a developer.

## If something goes wrong

A field that is invalid shows a red message under it and the document is not saved. Fix it and save again. For anything else, send the address of the page and what you did to a developer.
