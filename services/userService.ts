import { firestore } from "@/config/firebase"
import { UserDataType, ResponseType } from "@/types"
import { Firestore, updateDoc, doc } from "firebase/firestore"
import { uploadFileToCloudinary } from "./imgServices"

export const updateUser = async (
    uid: string,
    updateData: UserDataType
): Promise<ResponseType> => {
    try {
        if(updateData.image && updateData?.image?.uri){
            const imageUploadRes=await uploadFileToCloudinary(updateData.image,"users"

            )
            if(!imageUploadRes.success){
                return{
                    success:false,
                    msg:imageUploadRes.msg || "Failed to upload Image"
                };
            }
            updateData.image = imageUploadRes.data;
        };


        const userRef = doc(firestore, "users", uid);
        await updateDoc(userRef, updateData);

        return { success: true, msg: "Updated Successfully" }
    }
    catch (error: any) {
        console.log("error updating :", error)
        return { success: false, msg: error.message ?? "Update failed" };

    }
}