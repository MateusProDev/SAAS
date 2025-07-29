import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/preview/$siteId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/preview/$siteId"!</div>
}
