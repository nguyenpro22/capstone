type Translation = (key: string, params?: Record<string, any>) => string

export interface Props {
  t: Translation
}