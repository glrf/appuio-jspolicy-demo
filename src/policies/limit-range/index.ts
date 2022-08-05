import { V1LimitRange } from '@kubernetes/client-node'

let kind = request.kind.kind
let lrName = 'default'
let ns: string = ''

if (kind == 'Namespace') {
  ns = request.name ?? ''
  if (request.operation == 'DELETE') {
    exit()
  }
}
if (kind == 'LimitRange') {
  ns = request.namespace ?? ''
}

if (ns == '') {
  exit()
}


const desired: V1LimitRange = {
  apiVersion: "v1",
  kind: "LimitRange",
  metadata: {
    name: lrName,
    namespace: ns,
  },
  spec: {
    limits: [
      {
        type: "Container",
        defaultRequest: {
          cpu: "2",
        }
      }
    ]
  },
}

const found: V1LimitRange | undefined = get("LimitRange", "v1", ns + "/" + lrName)
if (!found) {
  const res = create(desired)
  if (!res.ok && res.reason !== "AlreadyExists") {
    requeue(res.message);
  }
  exit()
}

if (JSON.stringify(found?.spec ?? "") != JSON.stringify(desired?.spec ?? "")) {
  const res = update(desired)
  if (!res.ok && res.reason !== "AlreadyExists") {
    requeue(res.message);
  }
  exit()
}

