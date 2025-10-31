import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import InvoiceTable from '@/components/invoice/InvoiceTable'
import InvoiceHeader from '@/components/invoice/InvoiceHeader'

const page = () => {
    return (
        <>
            <PageHeader>
                <InvoiceHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <InvoiceTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page