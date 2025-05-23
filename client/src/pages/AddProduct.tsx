import DashboardLayout from '../components/layout/DashboardLayout'
import AddProductForm from '../components/forms/AddProductForm'

const AddProduct = () => {
  return (
    <DashboardLayout>
      <div className='space-y-6'>
       
        <AddProductForm />
      </div>
    </DashboardLayout>
  )
}

export default AddProduct
