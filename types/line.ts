export type LineWebhookBody = {
  destination: string
  events: LineEvent[]
}

export type LineEvent =
  | LineMessageEvent
  | LineFollowEvent
  | LineUnfollowEvent

export type LineMessageEvent = {
  type: 'message'
  replyToken: string
  source: LineSource
  timestamp: number
  message: LineMessage
}

export type LineFollowEvent = {
  type: 'follow'
  replyToken: string
  source: LineSource
  timestamp: number
}

export type LineUnfollowEvent = {
  type: 'unfollow'
  source: LineSource
  timestamp: number
}

export type LineSource = {
  type: 'user' | 'group' | 'room'
  userId: string
}

export type LineMessage = LineTextMessage | LineOtherMessage

export type LineTextMessage = {
  type: 'text'
  id: string
  text: string
}

export type LineOtherMessage = {
  type: 'sticker' | 'image' | 'video' | 'audio' | 'file' | 'location'
  id: string
}
