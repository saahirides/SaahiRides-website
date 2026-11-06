# SaahiRides Social Images — GitHub source archive

Supabase Storage bucket `social-images` is the central image library used by Social Studio. GitHub keeps the original repository assets and is treated as an import source; importing copies image files into Supabase RAW and never edits or deletes GitHub originals.

## Folder and approval structure

- Supabase `raw/`: new Admin uploads and imported GitHub images waiting for review.
- Supabase `approved/`: images explicitly approved in Social Studio.
- Supabase table `public.social_image_library`: filename, source, storage path, status, file type/size, and approval audit fields.
- Social Studio opens on APPROVED images first. RAW is a separate review view.

## Existing GitHub assets

The Admin → Social Studio → Social Images panel has **Import existing GitHub images**. It scans the entire `assets/` directory recursively and copies JPG, JPEG, PNG, WEBP and GIF files from every asset subfolder to Supabase RAW, preserving the source folder path in metadata. Existing GitHub files remain unchanged. Re-running the import skips items already registered.

## New uploads and publishing

1. Upload through Admin → Social Studio → Social Images. Files are saved in Supabase `raw/`.
2. Review each RAW image and select **Approve → APPROVED** to move it into Supabase `approved/`.
3. In APPROVED, select **Add to publishing composer** to attach it to the post draft.
4. Review caption, platforms and profile before publishing.

The library UI does not offer a delete action. GitHub originals are not deleted or overwritten by the import process.

Use descriptive filenames. Only upload imagery SaahiRides has permission to use. Never upload private customer data or images without consent. Music must be licensed for the business account and destination platform.
