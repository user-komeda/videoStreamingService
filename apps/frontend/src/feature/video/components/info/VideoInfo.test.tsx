import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { VideoVisibility } from '~/api/generated/models/videoVisibility'
import { VideoInfo } from '~/feature/video/components/info/VideoInfo'

import type { VideoResponse } from '~/api/generated/models'

describe('VideoInfo', () => {
  const video: VideoResponse = {
    id: 'vid-1',
    title: 'Super Video Title',
    visibility: VideoVisibility.Public,
  }

  it('renders title, handles subscribe toggle, and reaction buttons', async () => {
    const user = userEvent.setup()
    render(<VideoInfo video={video} />)

    expect(screen.getByText('Super Video Title')).toBeDefined()

    // Subscribe toggle
    const subBtn = screen.getByText('チャンネル登録')
    await user.click(subBtn)
    expect(screen.getByText('登録済み')).toBeDefined()

    // Like toggle
    const likeBtn = screen.getByText('0')
    await user.click(likeBtn)
    expect(screen.getByText('1')).toBeDefined()

    // Dislike toggle
    const dislikeBtn = screen.getByLabelText('低評価')
    await user.click(dislikeBtn)
    expect(screen.getByText('0')).toBeDefined()
  })
})
