# Evaluation

jsPolicy would be the middle ground between using Kyverno and it's YAML policies and writing each policy as a custom Go webhook.
We can write testable policies in Typescript without having to build and deploy custom images.

By putting some effort into tooling we should be able write these policies as part of a commodore component, which in the end only deploys the bundled javascript as a CRD
This would be similar to how we currently use Kyverno, but more powerful and especially testable.

Solution Teams can still write ad-hoc policies directly as CRDs / in the config hierarchy.
However this essentially means writing javascript in YAML, which is definitely not ideal and arguably worse than what Kyverno gives us.
This is an advantage over writing custom policies in Go, where this would not be possible.

We aren't Typescript experts.
Compared to writing policies in Go we would need to invest more time into learning the language and ecosystem.


## Pro

* Writing Policies in Typescript is a lot more powerful and flexible then Kyverno's configuration
* Writing Policies in Typescript is more flexible that writing policies in Go.
Policies can be completely (or partially) written as configuration.
* We can use proven tools such as jest for unit testing the policies
* Jspolicy supports writing full blown controllers, not just admission webhooks
* Interaction with K8s is delegated to Go and it's controller runtime library, which is very efficient and battle tested. 
Therefore we should not run into the rate-limit issues we have with Kyverno


## Con

* We aren't Typescript experts and to effectively use Jspolicy we would need to invest additional time
* The project is not as active as Kyverno.
It's not abandoned but also doesn't seem to be the most important project for lôft.
* It is unclear how much flexibility we can gain over policies in Go, without losing all safety by writing javascript in yaml.
This could potentially be improved by additional tooling in a component.
* Compared to Kyverno it is harder for Solution teams to write simple, ad-hoc, custom policies.
They can write javascript in yaml, but this is a substantial hurdle.
Could be improved by providing good tooling and javascript libraries.
