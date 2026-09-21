export type VideoActionResult =
  { success: true; videoId: string } | { success: false; error?: string }
