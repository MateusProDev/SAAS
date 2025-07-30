import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/site/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/site/$slug"!</div>
}
