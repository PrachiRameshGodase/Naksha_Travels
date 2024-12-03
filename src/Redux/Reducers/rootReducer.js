import { combineReducers } from 'redux';
import { accountListReducer, categoryListReducer, creditNoteListReducer, customListReducer, debitNoteListReducer, invoiceListReducer, itemListReducer, journalListReducer, purchseListReducer, quoatationListReducer, saleOrderListReducer, vendorListReducer } from './listApisReducers';
import { activeInactiveItemReducer, addItemsReducer, itemActivityReducer, itemDeleteReducer, itemExportReducer, itemImportReducer, itemsDetailReducer, itemStockeducer, stockItemsReducer } from './itemsReducers';
import { masterDataReducer, countriesDataReducer, citiesDataReducer, stateDataReducer, createCustomReducer, getCurrencyReducer, getTaxRateReducer, updateAddressReducer, expenseHeadListReducer, autoGenerateIdReducer, autoGenerateIdListReducer } from './globalReducers';
import { categoryStatusReducer, createCategoryReducer, createSubCategoryReducer, deleteCategoryReducer, subCategoryListReducer } from './categoryReducers';
import { createCustomerReducer, customerDeleteReducer, customerListReducer, customerStatusReducer, viewCustomerReducer } from './customerReducers';
import { quotationDeleteReducer, quotationDetailReducer, quotationSendReducer, quotationStatusReducer, quotationUpdateReducer } from './quotationReducers';
import { saleOrderDeleteReducer, saleOrderDetailReducer, saleOrderSendReducer, saleOrderStatusReducer } from './saleOrderReducers';
import { invoiceDeleteReducer, invoiceDetailReducer, invoiceMailSendReducer, invoicePendingReducer, invoiceSendReducer, invoiceStatusReducer } from './invoiceReducers';
import { creditNoteCreateReducers, creditNoteDeleteReducer, creditNoteDetailReducer, creditNoteStatusReducer, debitNoteDeleteReducer, debitNoteDetailReducer, debitNoteStatusReducer } from './noteReducers';
import { vendorCreateReducer, vendorDeleteReducer, vendorStatusReducer, vendorViewReducer } from './vendorReducers';
import { JournalDetailReducer, accountDeleteReducer, accountDetailsReducer, accountStatusReducer, accountTypeReducer, createAccountReducer, journalsReducer } from './accountReducers';
import { createPaymentReducer, paymentDeleteReducer, paymentDetailReducer, paymentListReducer, paymentStatusReducer } from './paymentReducers';
import { billDeleteReducer, billDetailReducer, billListReducer, billStatusReducer, pendingBillReducer } from './billReducers';
import { createPurchasesReducer, purchasesDeleteReducer, purchasesDetailsReducer, purchasesSendReducer, purchasesStatusReducer } from './purchasesReducers';
import { expenseCreateReducer, expenseDeleteReducer, expenseDetailReducer, expenseListReducer } from './expenseReducers';
import { createGRNreducer, GRNdeleteReducer, GRNdetailsReducer, GRNrecepitDetailReducer, GRNrecepitListReducer, GRNrecepitMoveItemReducer, GRNstatusReducer, listGRNreducer } from './grnReducers';
import { binCreateReducer, binDetailsReducer, binStatusReducer, binViewReducer, rackCreateReducer, rackDetailsReducer, rackStatusReducer, rackViewReducer, warehouseCreateReducer, warehouseDetailReducer, warehouseStatusReducer, warehouseViewReducer, zoneCreateReducer, zoneDetailsReducer, zoneStatusReducer, zoneViewReducer } from './warehouseReducers';

const reducer = combineReducers({
    addItemsReducer,

    stockAdjustment: stockItemsReducer,
    itemStock: itemStockeducer,
    itemDetail: itemsDetailReducer,
    itemList: itemListReducer,
    importItems: itemImportReducer,
    exportItems: itemExportReducer,
    activity: itemActivityReducer,

    masterData: masterDataReducer,
    autoId: autoGenerateIdReducer,
    autoIdList: autoGenerateIdListReducer,

    createCategory: createCategoryReducer,
    categoryStatus: categoryStatusReducer,
    createCustomer: createCustomerReducer,
    customerStatus: customerStatusReducer,
    customerDelete: customerDeleteReducer,
    viewCustomer: viewCustomerReducer,
    customerList: customerListReducer,
    categoryList: categoryListReducer,
    deleteCategory: deleteCategoryReducer,
    subCategoryList: subCategoryListReducer,

    getAccType: accountTypeReducer,
    createAccount: createAccountReducer,
    deleteAccount: accountDeleteReducer,
    accountList: accountListReducer,
    accountStatus: accountStatusReducer,
    accountDetails: accountDetailsReducer,

    journalList: journalListReducer,

    quoteList: quoatationListReducer,
    quoteDetail: quotationDetailReducer,
    quoteStatus: quotationStatusReducer,
    quoteDelete: quotationDeleteReducer,
    quoteSend: quotationSendReducer,
    quoteUpdate: quotationUpdateReducer,


    saleList: saleOrderListReducer,
    saleDetail: saleOrderDetailReducer,
    saleStatus: saleOrderStatusReducer,
    saleDelete: saleOrderDeleteReducer,
    saleSend: saleOrderSendReducer,

    vendorList: vendorListReducer,
    vendorView: vendorViewReducer,
    vendorDelete: vendorDeleteReducer,
    vendorStatus: vendorStatusReducer,
    purchseList: purchseListReducer,
    purchseSend: purchasesSendReducer,
    purchseStatus: purchasesStatusReducer,
    createVendor: vendorCreateReducer,

    invoiceDetail: invoiceDetailReducer,
    invoiceList: invoiceListReducer,
    invoicesStatus: invoiceStatusReducer,
    invoicesDelete: invoiceDeleteReducer,
    invoicePending: invoicePendingReducer,
    invoiceSend: invoiceMailSendReducer,
    invoiceSent: invoiceSendReducer,

    creditNoteStatus: creditNoteStatusReducer,
    createCreditNote: creditNoteCreateReducers,
    creditNoteList: creditNoteListReducer,
    creditNoteDetail: creditNoteDetailReducer,
    creditNoteDelete: creditNoteDeleteReducer,

    debitNoteList: debitNoteListReducer,
    debitNoteDetail: debitNoteDetailReducer,
    debitNoteDelete: debitNoteDeleteReducer,
    debitNoteStatus: debitNoteStatusReducer,

    countries: countriesDataReducer,
    states: stateDataReducer,
    cities: citiesDataReducer,

    status: activeInactiveItemReducer,
    deleteItem: itemDeleteReducer,
    createCustom: createCustomReducer,

    customList: customListReducer,

    getCurrency: getCurrencyReducer,
    getTaxRate: getTaxRateReducer,
    updateAddress: updateAddressReducer,
    createJournal: journalsReducer,


    paymentRecList: paymentListReducer,
    paymentRecDelete: paymentDeleteReducer,
    paymentRecDetail: paymentDetailReducer,
    paymentRecStatus: paymentStatusReducer,
    createPayment: createPaymentReducer,

    journalDetail: JournalDetailReducer,
    billList: billListReducer,
    billDetail: billDetailReducer,
    billDelete: billDeleteReducer,
    billStatuses: billStatusReducer,
    pendingBill: pendingBillReducer,
    createPurchase: createPurchasesReducer,
    detailsPurchase: purchasesDetailsReducer,
    deletePurchase: purchasesDeleteReducer,
    expenseCreate: expenseCreateReducer,
    expenseList: expenseListReducer,
    expenseHeadList: expenseHeadListReducer,
    expenseDelete: expenseDeleteReducer,
    expenseDetail: expenseDetailReducer,

    GRNcreate: createGRNreducer,
    GRNlist: listGRNreducer,
    GRNdetails: GRNdetailsReducer,
    GRNreceptList: GRNrecepitListReducer,
    GRNreceptDetail: GRNrecepitDetailReducer,
    GRNstatus: GRNstatusReducer,
    GRNdelete: GRNdeleteReducer,
    GRNitem: GRNrecepitMoveItemReducer,

    warehouseView: warehouseViewReducer,
    warehouseCreate: warehouseCreateReducer,
    warehouseDetail: warehouseDetailReducer,
    warehouseStatus: warehouseStatusReducer,

    zoneCrate: zoneCreateReducer,
    zoneView: zoneViewReducer,
    zoneDetail: zoneDetailsReducer,
    zoneStatus: zoneStatusReducer,


    rackCreate: rackCreateReducer,
    rackView: rackViewReducer,
    rackDetail: rackDetailsReducer,
    rackStatus: rackStatusReducer,

    binCreate: binCreateReducer,
    binView: binViewReducer,
    binDetail: binDetailsReducer,
    binStatus: binStatusReducer,


});

export default reducer;
