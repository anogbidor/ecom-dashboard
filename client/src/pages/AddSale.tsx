// client/src/pages/AddSale.tsx
import AddSaleForm from '../components/forms/AddSaleForm'
import DashboardLayout from '../components/layout/DashboardLayout'

const AddSale = () => {
 return (
    <DashboardLayout>
    <div className='p-6'>
      <AddSaleForm />
   </div>
    </DashboardLayout>
  )
}

export default AddSale
