import React from 'react'
import Footer from '@/components/shared/Footer'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import InverterTypeHeader from '@/components/inverter/InverterTypeHeader'
import InverterTypeTable from '@/components/inverter/InverterTypeTable'

const page = () => {
    return (
        <>
            <PageHeader>
                <InverterTypeHeader />
            </PageHeader>

            <div className='main-content'>
                <div className='row'>
                    <InverterTypeTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default page