import {
  Building2,
  Gift,
  KeyRound,
  LayoutDashboard,
  MailPlus,
  Settings,
  ShieldCheck,
  Users,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  description: string
  /** Flip to true when the feature's build step lands. */
  enabled: boolean
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

/** Information architecture from the spec (section 29). */
export const navGroups: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, description: 'Your workspace at a glance', enabled: true },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { label: 'Employees', to: '/employees', icon: Users, description: 'View and add team members', enabled: false },
      { label: 'Departments', to: '/departments', icon: Building2, description: 'Organize people into units', enabled: false },
      { label: 'Designations', to: '/designations', icon: Briefcase, description: 'Define job positions', enabled: false },
    ],
  },
  {
    label: 'Access control',
    items: [
      { label: 'Roles', to: '/roles', icon: ShieldCheck, description: 'Group permissions into roles', enabled: true },
      { label: 'Permissions', to: '/permissions', icon: KeyRound, description: 'See what each feature allows', enabled: false },
    ],
  },
  {
    label: 'Onboarding',
    items: [
      { label: 'Invitations', to: '/employee-invitations', icon: MailPlus, description: 'Invite employees to join', enabled: false },
    ],
  },
  {
    label: 'Rewards',
    items: [
      { label: 'Reward rules', to: '/reward-rules', icon: Gift, description: 'Set points for activities', enabled: false },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Organization', to: '/settings/organization', icon: Settings, description: 'Organization details and branding', enabled: false },
    ],
  },
]

export const allNavItems = navGroups.flatMap((g) => g.items)