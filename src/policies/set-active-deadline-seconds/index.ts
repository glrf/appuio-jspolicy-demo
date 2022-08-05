import { V1Pod } from '@kubernetes/client-node'

let pod = request.object as V1Pod;

const restartPolicy = pod?.spec?.restartPolicy ?? "Always"
const deadline = pod?.spec?.activeDeadlineSeconds ?? 0
if (restartPolicy == "Always" || deadline != 0) {
  allow()
}

if (!pod.spec) {
  // Should never happen, but let's not fail if it ever does
  allow()
}

pod.spec!.activeDeadlineSeconds = 1800
mutate(pod)
