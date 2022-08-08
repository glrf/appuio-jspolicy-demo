interface allow {
  decision: "allow"
}

interface deny {
  decision: "deny"
  reason: string
}

interface mutate {
  decision: "mutate"
  object: object
}

export type decision = allow | mutate | deny


export function Decide(dec: decision) {
  switch (dec.decision) {
    case "allow":
      allow()
      break
    case "deny":
      deny(dec.reason)
      break
    case "mutate":
      mutate(dec.object)
  }
}


export function Get<T>(kind: string, version: string, name: string, opt?: {
  cache?: 'smart' | boolean;
}): T | undefined {
  return get(kind, version, name, opt)
}

