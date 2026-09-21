import { describe, expect, it } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { uploadFormOpts } from '~/feature/upload/formOptions'

describe('uploadFormOpts', () => {
  it('has correct default values', () => {
    expect(uploadFormOpts.defaultValues).toEqual({
      title: '',
      description: '',
      visibility: VideoVisibility.Public,
    })
  })

  it('has validators defined', () => {
    expect(uploadFormOpts.validators).toBeDefined()
    expect(uploadFormOpts.validators?.onChange).toBeDefined()
  })
})
