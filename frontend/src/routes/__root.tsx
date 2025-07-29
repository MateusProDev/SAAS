import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from '../contexts/AuthContext'
import { PlanProvider } from '../contexts/PlanContext'

// Criar instância do Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlanProvider>
          <Outlet />
          {import.meta.env.DEV && (
            <>
              <TanStackRouterDevtools />
              <ReactQueryDevtools initialIsOpen={false} />
            </>
          )}
        </PlanProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
