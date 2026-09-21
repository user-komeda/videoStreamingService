import { Button } from '~/components/ui/button'
import {
  DescriptionField,
  TitleField,
  VisibilityField,
} from '~/feature/upload/components/UploadFormFields'

import type { UploadFormInstance } from '~/feature/upload/hooks/useUploadForm'

export const TitleFormField = ({ form }: { form: UploadFormInstance }) => (
  <form.Field name="title">
    {(field) => (
      <TitleField
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        isTouched={field.state.meta.isTouched}
        errors={field.state.meta.errors}
        isValidating={field.state.meta.isValidating}
      />
    )}
  </form.Field>
)

export const DescriptionFormField = ({
  form,
}: {
  form: UploadFormInstance
}) => (
  <form.Field name="description">
    {(field) => (
      <DescriptionField
        name={field.name}
        value={field.state.value ?? ''}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        isTouched={field.state.meta.isTouched}
        errors={field.state.meta.errors}
        isValidating={field.state.meta.isValidating}
      />
    )}
  </form.Field>
)

export const VisibilityFormField = ({ form }: { form: UploadFormInstance }) => (
  <form.Field name="visibility">
    {(field) => (
      <VisibilityField
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={field.handleChange}
        isTouched={field.state.meta.isTouched}
        errors={field.state.meta.errors}
        isValidating={field.state.meta.isValidating}
      />
    )}
  </form.Field>
)

export const SubmitFormField = ({ form }: { form: UploadFormInstance }) => (
  <form.Subscribe
    selector={(state) =>
      [state.canSubmit, state.isSubmitting, state.values.title] as const
    }
  >
    {([canSubmit, isSubmitting, title]) => (
      <Button
        type="submit"
        disabled={!canSubmit || Boolean(isSubmitting) || !title?.trim()}
        className="w-full"
      >
        {isSubmitting ? '保存中...' : '次へ進む'}
      </Button>
    )}
  </form.Subscribe>
)
