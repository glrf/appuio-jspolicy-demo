import { V1Namespace, V1ConfigMap } from '@kubernetes/client-node'
import { V1AdmissionRequest } from "@jspolicy/types";
import { decision, Get } from "../../lib/runtime"

export function handle(req: V1AdmissionRequest): decision {

  let ns: V1Namespace = req.object ?? {};
  const user: string = req.userInfo.username ?? ''

  let dec: decision = { decision: 'allow' }

  if (!ns.metadata) {
    ns.metadata = {}
  }
  if (!ns.metadata.labels) {
    ns.metadata.labels = {}
  }

  let group = ns.metadata?.labels?.group
  if (group === undefined && req.operation === "CREATE") {
    const cm = Get("ConfigMap", "v1", "default/default-groups") as V1ConfigMap
    const data = cm?.data ?? {}
    group = data[user] ?? ''
    ns.metadata.labels.group = group
    dec = {
      decision: 'mutate',
      object: ns,
    }
  }

  if (group === '') {
    return {
      decision: 'deny',
      reason: "must set group label"
    }
  }
  if (!req.userInfo.groups?.includes(group)) {
    return {
      decision: 'deny',
      reason: "not in group " + group
    }
  }
  return dec
}
