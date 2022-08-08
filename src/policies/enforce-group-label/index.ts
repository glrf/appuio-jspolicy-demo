import { handle } from "./handler"
import { Decide } from "../../lib/runtime"

Decide(handle(request))
