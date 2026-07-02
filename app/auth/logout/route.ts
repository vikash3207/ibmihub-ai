import { logout } from '@/lib/actions/auth'

export async function POST() {
  await logout()
}
