import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { Input } from '~/components/ui/input'

interface FieldMeta {
  isTouched?: boolean
  errors?: unknown[]
  isValidating?: boolean
}

export const FieldInfo = ({ isTouched, errors, isValidating }: FieldMeta) => {
  const hasErrors = isTouched && errors && errors.length > 0
  const formattedErrors = errors
    ?.map((err) => {
      if (typeof err === 'string') {
        return err
      }
      if (err && typeof err === 'object' && 'message' in err) {
        return String(err.message)
      }
      return String(err)
    })
    .filter(Boolean)

  return (
    <>
      {hasErrors && formattedErrors && formattedErrors.length > 0 && (
        <p className="text-destructive text-sm">{formattedErrors.join(', ')}</p>
      )}
      {isValidating && (
        <p className="text-muted-foreground text-xs">検証中...</p>
      )}
    </>
  )
}

interface StringFieldProps extends FieldMeta {
  name: string
  value: string
  onBlur: () => void
  onChange: (value: string) => void
}

export const TitleField = (props: StringFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-foreground text-sm font-medium">
      タイトル <span className="text-destructive">*</span>
    </label>
    <Input
      id={props.name}
      name={props.name}
      value={props.value}
      onBlur={props.onBlur}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder="動画のタイトルを入力"
      maxLength={100}
    />
    <FieldInfo {...props} />
  </div>
)

export const DescriptionField = (props: StringFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-foreground text-sm font-medium">
      説明
    </label>
    <textarea
      id={props.name}
      name={props.name}
      value={props.value}
      onBlur={props.onBlur}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder="動画の説明を入力"
      rows={4}
      maxLength={1000}
      className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none focus-visible:ring-3 md:text-sm"
    />
    <FieldInfo {...props} />
  </div>
)

interface VisibilityFieldProps extends FieldMeta {
  name: string
  value: VideoVisibility
  onBlur: () => void
  onChange: (value: VideoVisibility) => void
}

export const VisibilityField = (props: VisibilityFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-foreground text-sm font-medium">
      公開設定 <span className="text-destructive">*</span>
    </label>
    <select
      id={props.name}
      name={props.name}
      value={props.value}
      onBlur={props.onBlur}
      onChange={(e) => props.onChange(e.target.value as VideoVisibility)}
      className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-3 md:text-sm"
    >
      <option value={VideoVisibility.Public}>公開 (Public)</option>
      <option value={VideoVisibility.Private}>非公開 (Private)</option>
    </select>
    <FieldInfo {...props} />
  </div>
)
