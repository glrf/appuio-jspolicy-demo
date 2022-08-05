# APPUiO jspolicy Demo

This is a demo project to showcase the capabilites of jspolicy for writing policies for APPUiO


## Setup

Start k3d cluster

```
k3d cluster create jspolicy-test
```

Install jspolicy

```
helm install jspolicy jspolicy -n jspolicy --create-namespace --repo https://charts.loft.sh
```

Build and apply policies

```
npm install
npm run compile
kubectl apply -f policies/
```


## Demo Policies


### Enforce Group Label

`src/policies/enforce-group-label`

This policy ensures that each namespace belongs to a group.


* Enforce that every created namespace has a label `group` 
* Enforce that the user creating or editing the namespace is a member of the group in the label.
* Default groups can be specified in a configmap `default/default-groups`. 
If a user does not add a label `group` the policy will add the users default group as the `group` label.

#### Demo

* Try to create namespace without group.

      kubectl create ns foo

  This should be denied.

* Create namspace with group `foo` when not in group `foo`

      kubectl apply -f demo/group-label/ns-foo.yaml

  This should be denied.

* Create namspace with group `foo`

      # Act as user bob in group foo (and system:masters to have all necessary permissions)
      kubectl --as bob --as-group foo --as-group system:masters apply -f demo/group-label/ns-foo.yaml

  This should succeed

* Configure default groups

      # Set `buzz` as bob's default group
      kubectl apply -f demo/group-label/default-groups.yaml

* Create namespace without group as `bob`

      # Act as user bob in group buzz (and system:masters to have all necessary permissions)
      kubectl --as bob --as-group buzz --as-group system:masters create ns ns-buzz

  This should succeed and add a label `group: buzz`.


### Default Limit Range

`src/policies/ensure-default-objects`

This policy ensures that there is a LimitRange every user namespace.

### Default Active Deadline Seconds

`src/policies/set-active-deadline-seconds`

This policy ensures that all "runonce" pods have .spec.activeDeadlineSeconds set.

#### Demo

* Create a runonce pod without a deadline

      kubectl apply -f demo/active-deadline/hello.yaml

  The pod will get a default value for `activeDeadlineSeconds` of `1800`.
  You can observe this with

      kubectl get pod hello -o yaml

* Create a runonce pod with a deadline

      kubectl apply -f demo/active-deadline/hello-deadline.yaml

  The pod will keep it's deadline of `activeDeadlineSeconds` of `142`.
  You can observe this with

      kubectl get pod hello-deadline -o yaml

* Create a job without a deadline

      kubectl apply -f demo/active-deadline/job.yaml

  The pod resulting from the job will get a default value for `activeDeadlineSeconds` of `1800`.
  You can observe this with
      
      # Find pod created by job (similar to hello-2h2r)
      kubectl get pod
      kubectl get pod <job-pod> -o yaml

* Create a long running job, i.e. with `restart: Always`.

      kubectl apply -f demo/active-deadline/nginx.yaml
  
  The pod will not get a deadline.
  You can observe this with

      kubectl get pod nginx -o yaml


### Patching default namespace

`src/policies/patch-default-namespace`

This policy esures that the default namespace has some fixed labels and any change will be reverted.

NOTE: This is a POC policy to show that we can patch existing resources and could implement a similar feature set as [resource-locker](https://github.com/redhat-cop/resource-locker-operator)
