import { WalletType, ResponseType } from "@/types"
import { collection, deleteDoc, doc, getDocs, query, setDoc, where, writeBatch } from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { uploadFileToCloudinary } from "./imgServices";


export const createOrUpdateWallet = async (
    walletData: Partial<WalletType>
): Promise<ResponseType> => {

    try {
        let walletToSave = { ...walletData };

        if (walletData.image) {
            const imageUploadRes = await uploadFileToCloudinary(walletData.image, "wallets");
            if (!imageUploadRes.success) {
                return {
                    success: false,
                    msg: imageUploadRes.msg || "Failed to upload Wallet Icon"
                };
            }
            walletToSave.image = imageUploadRes.data;
        };

        if (!walletData.id) {
            //newWallet
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpenses = 0;
            walletToSave.created = new Date();
        }
        const walletRef = walletData?.id ? doc(firestore, "wallets", walletData?.id) : doc(collection(firestore, "wallets"));
        await setDoc(walletRef, walletToSave, { merge: true }) //update the data provided
        return { success: true, data: { ...walletToSave, id: walletRef?.id } }
    } catch (error) {
        console.log("Error in createOrUpdateWallet:", error);
        return {
            success: false,
            msg: "Something went wrong while saving the wallet",
        };
    }
}


export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
    try {
        const walletRef = doc(firestore, "wallets", walletId);
        await deleteDoc(walletRef);
        

        deleteWalletByWalletId(walletId)


        return { success: true, msg: "Wallet deleted successfully" }

    } catch (error: any) {
        return { success: false, msg: error.msg }
    }
}
export const deleteWalletByWalletId = async (walletId: string): Promise<ResponseType> => {
    try {
        let hasMoreTransaction = true;

        while (hasMoreTransaction) {
            const transationQuery = query(
                collection(firestore, "transactions"),
                where('walletId', '==', walletId)
            );

            const transactionSnapshot = await getDocs(transationQuery)
            if (transactionSnapshot.size == 0) {
                hasMoreTransaction = false;
                break;
            }


            const batch = writeBatch(firestore);
            transactionSnapshot.forEach((transactionDoc) => {
                batch.delete(transactionDoc.ref);
            })


            await batch.commit();
        }

        return { success: true, msg: "Deleted Successfully" }
    } catch (error: any) {
        return { success: false, msg: error.msg }
    }
}