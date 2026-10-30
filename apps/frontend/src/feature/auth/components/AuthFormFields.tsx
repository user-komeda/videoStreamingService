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

export const EmailField = (props: StringFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-foreground text-sm font-medium">
      メールアドレス <span className="text-destructive">*</span>
    </label>
    <Input
      id={props.name}
      name={props.name}
      type="email"
      value={props.value}
      onBlur={props.onBlur}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder="example@example.com"
      autoComplete="email"
    />
    <FieldInfo {...props} />
  </div>
)

export const PasswordField = (props: StringFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-foreground text-sm font-medium">
      パスワード <span className="text-destructive">*</span>
    </label>
    <Input
      id={props.name}
      name={props.name}
      type="password"
      value={props.value}
      onBlur={props.onBlur}
      onChange={(e) => props.onChange(e.target.value)}
      placeholder="••••••••"
      autoComplete="current-password"
    />
    <FieldInfo {...props} />
  </div>
)
