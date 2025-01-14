import React from 'react'
import { startCase } from 'lodash'
import OrgControl from './_components/org-control'
import { auth } from '@clerk/nextjs/server'

export async function generateMetadata() {
  const { orgSlug } = await auth();

  return {
    title:startCase(orgSlug || "organization")
  }
}

const OrgasnizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  )
}

export default OrgasnizationIdLayout
