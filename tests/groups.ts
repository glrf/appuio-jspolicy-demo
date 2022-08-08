import { handle } from "../src/policies/enforce-group-label/handler"
import * as runtime from "../src/lib/runtime"

import { V1UserInfo, V1AdmissionRequest } from "@jspolicy/types"
import { V1Namespace } from '@kubernetes/client-node'

jest.mock('../src/lib/runtime')

function newTestRequest(name: string, obj: object | undefined, user: V1UserInfo): V1AdmissionRequest {
  return {
    uid: "aaa",
    name: name,
    userInfo: user,
    kind: {
      kind: "Namespace",
      group: "",
      version: "v1"
    },
    operation: "CREATE",
    resource: {
      group: "",
      version: "v1",
      resource: "namespaces",
    },
    object: obj,
  }
}

describe("Test group label", () => {

  test("Should allow", () => {
    jest.spyOn(runtime, "Get").mockReturnValue({})
    const dec = handle(newTestRequest("foo", {
      metadata: {
        labels: {
          group: "foo",
        }
      }
    }, {
      groups: ["foo"],
    }))
    expect(dec.decision).toBe("allow")
  })

  test("Should deny", () => {
    jest.spyOn(runtime, "Get").mockReturnValue({})
    const dec = handle(newTestRequest("foo", {
      metadata: {
        labels: {
          group: "foo",
        }
      }
    }, {}))
    expect(dec.decision).toBe("deny")
  })

  test("Should deny", () => {
    jest.spyOn(runtime, "Get").mockReturnValue({})
    const dec = handle(newTestRequest("foo", {
      metadata: {
      }
    }, {}))
    expect(dec.decision).toBe("deny")
  })

  test("Should deny", () => {
    jest.spyOn(runtime, "Get").mockReturnValue({})
    const dec = handle(newTestRequest("foo", undefined, {}))
    expect(dec.decision).toBe("deny")
  })

  test("Should modify", () => {
    jest.spyOn(runtime, "Get").mockReturnValue({
      data: {
        'bob': 'buzz',
      }
    })
    const dec = handle(newTestRequest("foo", {}, {
      username: "bob",
      groups: ["buzz"],
    }))
    expect(dec.decision).toBe("mutate")
    if (dec.decision == "mutate") {
      const ns: V1Namespace = dec.object
      expect(ns.metadata?.labels?.group).toBe("buzz")
    }
  })
  test("Should modify and deny", () => {
    jest.spyOn(runtime, "Get").mockReturnValue({
      data: {
        'bob': 'buzz',
      }
    })
    const dec = handle(newTestRequest("foo", {}, {
      username: "bob",
      groups: [""],
    }))
    expect(dec.decision).toBe("deny")
  })

})
