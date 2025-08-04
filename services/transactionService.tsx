import { firestore } from "@/config/firebase";

import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { createOrUpdateWallet } from "./walletService";
import { getLast12Months, getLast12MonthsModified, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "react-native-size-matters";
import { uploadFileToCloudinary } from "./imgServices";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
    try {
        const { id, type, walletId, image, amount } = transactionData;
        if (!amount || amount <= 0 || !walletId || !type) {
            return { success: false, msg: "Invalid Transaction data" }
        }
        if (id) {

            const oldTransactionSnapshot = getDoc(doc(firestore, 'transactions', id));
            const oldTransaction = (await oldTransactionSnapshot).data() as TransactionType;
            const shouldRevertOrigignal = oldTransaction.type != type || oldTransaction.amount != amount || oldTransaction.walletId != walletId;
            if (shouldRevertOrigignal) {
                let res = await revertAndUpdateWallets(oldTransaction, Number(amount), type, walletId);
                if (!res.success) return res;
            }

        }
        else {
            //update for new 
            let res = await updateWalletForNewTransaction(
                walletId,
                Number(amount!),
                type,
            );
            if (!res.success) return res;

            if (image) {
                const imageUploadRes = await uploadFileToCloudinary(image, "transactions"

                )
                if (!imageUploadRes.success) {
                    return {
                        success: false,
                        msg: imageUploadRes.msg || "Failed to upload Image"
                    };
                }
                transactionData.image = imageUploadRes.data;
            };
        }
        const transactionRef = id ? doc(firestore, "transactions", id) : doc(collection(firestore, "transactions"))


        await setDoc(transactionRef, transactionData, { merge: true });


        return { success: true, data: { ...transactionData, id: transactionRef?.id } }
    } catch (error: any) {

        return { success: false, msg: error.msg }
    }
}

const updateWalletForNewTransaction = async (
    walletID: string,
    amount: number,
    type: string,
) => {

    try {
        const walletRef = doc(firestore, "wallets", walletID);
        const walletSnapshot = await getDoc(walletRef);
        if (!walletSnapshot.exists()) {
            return { success: false, msg: 'Wallet not found' }
        }
        const walletData = walletSnapshot.data() as WalletType;
        if (type == 'expense' && walletData.amount! - amount < 0) {
            return { success: false, msg: 'Selected Wallet do not have enough balance!' }
        };

        const updateType = type == 'income' ? "totalIncome" : "totalExpenses";
        const updatedWalletAmount = type == 'income' ? Number(walletData.amount) + amount : Number(walletData.amount) - amount;
        const updatedTotals = type == 'income' ? Number(walletData.totalIncome) + amount : Number(walletData.totalExpenses) + amount;

        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updateType]: updatedTotals
        })
        return { success: true }
    } catch (error: any) {

        return { success: false, msg: error.msg }
    }

}


const revertAndUpdateWallets = async (
    oldTransaction: TransactionType,
    newTransactionAmount: number,
    newTransactionType: String,
    newWalletId: string,
) => {

    try {
        const originalWalletSnapshot = await getDoc(doc(firestore, "wallets", oldTransaction.walletId));
        const originalWallet = originalWalletSnapshot.data() as WalletType;
        let newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));

        let newWallet = newWalletSnapshot.data() as WalletType;

        const revertType = oldTransaction.type == "income" ? "totalIncome" : "totalExpenses";
        const revertIncomeExpenses: number = oldTransaction.type == "income" ? -Number(oldTransaction.amount) : Number(oldTransaction.amount);

        const revertedWalletAmount = Number(originalWallet.amount) + revertIncomeExpenses;

        const revertedIncomeExpenseAmount = Number(originalWallet[revertType]) - Number(oldTransaction.amount);

        if (newTransactionType == 'expense') {
            //if user tries to convert income to expense on the same wallet with insufficient balance
            if (oldTransaction.walletId == newWalletId && revertedWalletAmount < newTransactionAmount) {
                return { success: false, msg: 'Selected Wallet do not have enought amount' };
            }
            //if user tries to convert income to expense on different wallet  with insufficient balance

            if (newWallet.amount! < newTransactionAmount) {
                return { success: false, msg: 'Selected Wallet do not have enought amount' };
            }

            await createOrUpdateWallet({
                id: oldTransaction.walletId,
                amount: revertedWalletAmount,
                [revertType]: revertedIncomeExpenseAmount,
            });





            /////////////////////////////////////////////

            //refetch the newWallet 

            newWalletSnapshot = await getDoc(doc(firestore, "wallets", newWalletId));

            newWallet = newWalletSnapshot.data() as WalletType;

            const updateType =
                newTransactionType == "income" ? "totalIncome" : 'totalExpenses';

            const updatedTransacationAmount: number =
                newTransactionType == "income" ?
                    Number(newTransactionAmount) : -Number(newTransactionAmount);

            const newWalletAmount = Number(newWallet[updateType]! + Number(newTransactionAmount))

            const newIncomeExpenseAmount = Number(
                newWallet[updateType]! + Number(newTransactionAmount)
            );



            await createOrUpdateWallet({
                id: newWalletId,
                amount: newWalletAmount,
                [updateType]: newIncomeExpenseAmount,
            });
        }





        return { success: true }
    } catch (error: any) {

        return { success: false, msg: error.msg }
    }

}


export const deleteTransaction = async (
    transactionId: string,
    walletId: string,
) => {
    try {
        const transactionRef = doc(firestore, 'transactions', transactionId)

        const transactionSnapshot = await getDoc(transactionRef);


        if (!transactionSnapshot.exists()) {
            return { success: false, msg: "Transaction not found" }
        }


        const transactionData = transactionSnapshot.data() as TransactionType;
        const transactionAmount = transactionData?.amount;
        const transactionType = transactionData?.type;

        const walletSnapshot = await getDoc(doc(firestore, "wallets", walletId));

        const walletData = walletSnapshot.data() as WalletType;

        //check fields to be updated


        const updateType = transactionType == 'income' ? "totalIncome" : 'totalExpenses';
        const newWalletAmount = walletData?.amount! - (
            transactionType == 'income' ? transactionAmount : -transactionAmount
        );
        const newIncomeExpenseAmount = walletData[updateType]! - transactionAmount;



        if (transactionType == 'income' && newWalletAmount < 0) {
            return { success: false, msg: "You cannot delete this transaction" }

        }


        await createOrUpdateWallet({
            id: walletId,
            amount: newWalletAmount,
            [updateType]: newIncomeExpenseAmount
        });

        await deleteDoc(transactionRef);
        return { success: true }
    }
    catch (error: any) {

        return { success: false, msg: error.msg }
    }
}

export const fetchWeeklyStats = async (

    uid: string

): Promise<ResponseType> => {

    try {
        const db = firestore;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);


        const transactionQuery = query(
            collection(db, 'transactions'),
            where('date', '>=', Timestamp.fromDate(sevenDaysAgo)),
            where('date', '<=', Timestamp.fromDate(today)),
            where('uid', '==', uid),
            orderBy('date', 'desc'),
        );

        const querySnapshot = await getDocs(transactionQuery);
        const weeklyData = getLast7Days();
        const transactions: TransactionType[] = [];

        //mapping each transaction
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionDate = (transaction.date as Timestamp).toDate().toISOString().split("T")[0]; //as specific date

            const dayData = weeklyData.find((day) => day.date === transactionDate);

            if (dayData) {
                if (transaction.type == 'income') {
                    dayData.income += transaction.amount;
                } else if (transaction.type == 'expense') {
                    dayData.expense += transaction.amount;
                }
            }




        });


        const stats = weeklyData.flatMap((day) => [
            {
                value: day.income,
                label: day.day,
                spacing: scale(4),
                labelWidth: scale(30),
                frontColor: '#7CFC00'
            },
            {
                value: day.expense,
                frontColor: 'red'
            }
        ]);



        return {
            success: true, data: {
                stats,
                transactions
            }
        }
    } catch (error: any) {

        return { success: false, msg: error.msg }
    }

}

export const fetchMonthlyStats = async (

    uid: string

): Promise<ResponseType> => {
    try {
        const db = firestore;
        const today = new Date();
        const twelveMonthAgo = new Date(today);
        twelveMonthAgo.setMonth(today.getMonth() - 12);

        //Define Query to fetch transactions in the last 12 months
        const transactionQuery = query(
            collection(db, 'transactions'),
            where('date', '>=', Timestamp.fromDate(twelveMonthAgo)),
            where('date', '<=', Timestamp.fromDate(today)),
            where('uid', '==', uid),
            orderBy('date', 'desc'),
        );
       


        //Process transactions to calculate income and expense for each month
        const querySnapshot = await getDocs(transactionQuery);
        const monthlyData = getLast12MonthsModified();
        const transactions: TransactionType[] = [];

        //mapping each transaction
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id; //include document id transaction Data
            transactions.push(transaction);

            const transactionDate = (transaction.date as Timestamp).toDate(); 
            const monthName = transactionDate.toLocaleString("default", {
                month: 'short',
            });

            const shortYear = transactionDate.getFullYear().toString().slice(-2);
           
            const monthData = monthlyData.find((month) => month.month === `${monthName} ${shortYear}`);

            if (monthData) {
                if (transaction.type === 'income') {
                    monthData.income += transaction.amount;
                } else if (transaction.type === 'expense') {
                    monthData.expense += transaction.amount;
                }
            }

        });

        //Reformat monthlydata for the bar chart 
        const stats = monthlyData.flatMap((month) => [
            {
                value: month.income,
                label: month.month,
                spacing: scale(4),
                labelWidth: scale(30),
                frontColor: '#7CFC00'
            },
            {
                value: month.expense,
                frontColor: 'red'
            }
        ]);



        return {
            success: true, data: {
                stats,
                transactions
            }
        }
    } catch (error: any) {

        return { success: false, msg: error.msg }
    }

}

export const fetchYearlyStats = async (

    uid: string

): Promise<ResponseType> => {

    try {
        const db = firestore;



        const transactionQuery = query(
            collection(db, 'transactions'),
            orderBy('date', 'desc'),
            where('uid', '==', uid)
        );

        const querySnapshot = await getDocs(transactionQuery);
        const transactions: TransactionType[] = [];

        const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
            const transactionDate = doc.data().date.toDate();
            return transactionDate < earliest ? transactionDate : earliest;
        }, new Date())


        const firstYear = firstTransaction.getFullYear();
        const currentYear = new Date().getFullYear();

        const yearlyData = getYearsRange(firstYear, currentYear);
        //mapping each transaction




        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionYear = (transaction.date as Timestamp).toDate().getFullYear(); //as specific date


            const yearData = yearlyData.find((item: any) => item.year === transactionYear.toString());

            if (yearData) {
                if (transaction.type == 'income') {
                    yearData.income += transaction.amount;
                } else if (transaction.type == 'expense') {
                    yearData.expense += transaction.amount;
                }
            }




        });


        const stats = yearlyData.flatMap((year: any) => [
            {
                value: year.income,
                label: year.year,
                spacing: scale(4),
                labelWidth: scale(35),
                frontColor: '#7CFC00'
            },
            {
                value: year.expense,
                frontColor: 'red'
            }
        ]);


        // console.log('fetchMYearly called');

        return {
            success: true, data: {
                stats,
                transactions
            }
        }
    } catch (error: any) {

        return { success: false, msg: error.msg }
    }

}