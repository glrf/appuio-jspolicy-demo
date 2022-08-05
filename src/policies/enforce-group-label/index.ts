import { V1Namespace, V1ConfigMap } from '@kubernetes/client-node'

let ns = request.object as V1Namespace;
const user: string = request.userInfo.username ?? ''

if (!ns.metadata) {
  ns.metadata = {}
}
if (!ns.metadata.labels) {
  ns.metadata.labels = {}
}

let group = ns.metadata?.labels?.group
if (group === undefined && request.operation === "CREATE") {
  const cm = get("ConfigMap", "v1", "default/default-groups") as V1ConfigMap
  const data = cm?.data ?? {}
  group = data[user] ?? ''
  ns.metadata.labels.group = group
}

if (group === '') {
  deny("must set group label")
}
if (!request.userInfo.groups?.includes(group!)) {
  deny("not in group " + group)
}

mutate(ns)
