import { Input } from '~/components/ui/input'

import type { VideoVisibility } from '~/api/generated/models'

export const EditTitleField = ({
  title,
  setTitle,
}: {
  title: string
  setTitle: (v: string) => void
}) => (
  <div>
    <label htmlFor="edit-title" className="text-foreground text-sm font-medium">
      タイトル
    </label>
    <Input
      id="edit-title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      required
      maxLength={100}
      className="mt-1"
    />
  </div>
)

export const EditDescriptionField = ({
  description,
  setDescription,
}: {
  description: string
  setDescription: (v: string) => void
}) => (
  <div>
    <label
      htmlFor="edit-description"
      className="text-foreground text-sm font-medium"
    >
      説明
    </label>
    <textarea
      id="edit-description"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      rows={3}
      maxLength={1000}
      className="border-input focus-visible:ring-ring mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-1 focus-visible:outline-hidden"
    />
  </div>
)

export const EditVisibilityField = ({
  visibility,
  setVisibility,
}: {
  visibility: VideoVisibility
  setVisibility: (v: VideoVisibility) => void
}) => (
  <div>
    <label
      htmlFor="edit-visibility"
      className="text-foreground text-sm font-medium"
    >
      公開設定
    </label>
    <select
      id="edit-visibility"
      value={visibility}
      onChange={(e) => setVisibility(e.target.value as VideoVisibility)}
      className="border-input bg-background focus-visible:ring-ring mt-1 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-hidden"
    >
      <option value="public">公開</option>
      <option value="unlisted">限定公開</option>
      <option value="private">非公開</option>
    </select>
  </div>
)
