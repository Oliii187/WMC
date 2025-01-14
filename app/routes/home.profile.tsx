import { LoaderFunction, ActionFunction, redirect, json } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react"
import { Modal } from "~/components/modal";
import { getUser, requireUserId, logout } from "~/utils/auth.server";
import { useState, useRef, useEffect } from "react";
import { FormField } from '~/components/form-field'
import { departments } from "~/utils/constants";
import { SelectBox } from "~/components/select-box";
import { validateName } from "~/utils/validators.server";
import { updateUser, deleteUser} from "~/utils/user.server";
import { prisma } from "~/utils/prisma.server";
import { uploadProfilePicture } from '~/utils/upload.server'; // Adjust the import path as needed
 // Adjust the import path as needed


export const action: ActionFunction = async ({ request }) => {
   const formData = await request.formData();

   console.log("formData",formData);
   const userId = await requireUserId(request);
   
   


    const profilePicture = formData.get("profilePicture") as File | null;
    if (profilePicture !== null && profilePicture instanceof File) {
        const imgPath = await uploadProfilePicture(profilePicture);
        await prisma.profile.update({
            data: {
              profilePicture: imgPath,
            },
        
            where: {
              userId: userId,
            },
          });
    }
    
    type Department = 'MARKETING' | 'ENGINEERING' | 'HR' | 'SALES'
    // 1
 
    

    let firstName = formData.get('firstName')
    let lastName = formData.get('lastName')
    let department = formData.get('department')
    const action = formData.get('_action')
    const actionData = useActionData()
    const firstLoad = useRef(true)
 
    // 2
 
    switch (action) {
        case 'save':

    if (
 
       typeof firstName !== 'string'
       || typeof lastName !== 'string'
       || typeof department !== 'string'
 
    ) {
 
       return json({ error: `Invalid Form Data` }, { status: 400 });
 
    }
 
 
    // 3
 
    const errors = {
       firstName: validateName(firstName),
       lastName: validateName(lastName),
       department: validateName(department)
 
    }
 
 
    if (Object.values(errors).some(Boolean))
       return json({ errors, fields: { department, firstName, lastName } }, { status: 400 });
 
 
    await updateUser(userId, { 
        firstName, 
        lastName, 
        department: department as Department
    })
    // 4
 
    return redirect('/home')

    case 'delete':
        await deleteUser(userId)
         return logout(request)
    default:
        return json({ error: `Invalid Form Data` }, { status: 400 });
}
}
export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request)
    return json({ user })
}

export default function ProfileSettings() {
const { user } = useLoaderData<{ user: { profile: { firstName: string, lastName: string, department: string, profilePicture: string } } }>();

   const [formData, setFormData] = useState({
       firstName: user?.profile?.firstName,
       lastName: user?.profile?.lastName,
       department: user?.profile?.department || 'MARKETING',
       profilePicture: user?.profile?.profilePicture || '',
      });

   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
       setFormData((form) => ({ ...form, [field]: event.target.value }));
   };

   const handleFileUpload = async (file: File) => {

      let inputFormData = new FormData()

      inputFormData.append('profile-pic', file)

      const response = await fetch('/avatar', {

         method: 'POST',

         body: inputFormData

      })

      const { imageUrl } = await response.json()

      setFormData({

         ...formData,

         profilePicture: imageUrl

      })

    }

   return (
       <Modal isOpen={true} className="w-1/3">
           <div className="p-6 bg-gray-100 rounded-xl shadow-lg">
               <h2 className="text-4xl font-semibold text-blue-600 text-center mb-6">Your Profile</h2>
               <div className="w-1/3">
</div>
               <form method="post" encType="multipart/form-data" className="space-y-4" onSubmit={e => !confirm('Are you sure?') ? e.preventDefault() : true}>
                   <FormField
                       htmlFor="firstName"
                       label="First Name"
                       value={formData.firstName}
                       onChange={(e) => handleInputChange(e, 'firstName')}
                   />
                   <FormField
                       htmlFor="lastName"
                       label="Last Name"
                       value={formData.lastName}
                       onChange={(e) => handleInputChange(e, 'lastName')}
                   />



                   <SelectBox
                       id="department"
                       label="Department"
                       name="department"
                       options={departments}
                       value={formData.department}
                       onChange={(e) => handleInputChange(e, 'department')}
                       className="w-full rounded-xl px-3 py-2"
                   />

<button name="_action" value="delete" className="rounded-xl w-full bg-red-300 font-semibold text-white mt-4 px-16 py-2 transition duration-300 ease-in-out hover:bg-red-400 hover:-translate-y-1">
        Delete Account
    </button>

                   <div className="flex justify-between items-center mt-6">
                       <button
                           type="submit"
                           className="rounded-lg bg-yellow-400 text-blue-600 font-semibold px-6 py-2 hover:bg-yellow-500 hover:scale-105 transition transform"
                           name="_action"
                           value="save"
                       >
                           Save
                       </button>
                       <label
                           htmlFor="profilePicture"
                           className="block rounded-lg bg-gray-200 text-gray-700 font-medium px-6 py-2 cursor-pointer hover:bg-gray-300 hover:scale-105 transition transform"
                       >
                           Choose File
                           <input
                               type="file"
                               name="profilePicture"
                               id="profilePicture"
                               className="hidden"
                           />
                       </label>
                   </div>
               </form>
           </div>
       </Modal>
   );
}