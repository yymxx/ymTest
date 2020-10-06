export const allApi = {
  updateImg: 'http://120.202.177.101:8090/ProvideManager/webFile/fileUpload.htm',
  oldtransfers: {
    getList: '/web/changes/findChanges.htm',
    addData: '/web/changes/saveChanges.htm',
    updateData: '/web/changes/updateChanges.htm',
    delData: '/web/changes/delChanges.htm',
    getById: '/web/changes/findChangesById.htm'
  },
  organization: {
    getList: '/web/organization/findOrganization.htm',
    addData: '/web/organization/saveOrganization.htm',
    updateData: '/web/organization/updOrganization.htm',
    delData: '/web/organization/delOrganization.htm'
  },
  organstaff: {
    getList: '/web/staff/findStaff.htm',
    addData: '/web/staff/saveStaff.htm',
    updateData: '/web/staff/updateStaff.htm',
    delData: '/web/staff/delBatchStaff.htm'
  },
  evaluationrecord: {
    getList: '/web/evaluationrecord/findEvaluationrecord.htm',
    addData: '/web/evaluationrecord/saveEvaluationrecord.htm',
    updateData: '/web/evaluationrecord/updEvaluationrecord.htm',
    delData: '/web/evaluationrecord/delBatchEvaluationrecord.htm'
  },
  subsidystandard: {
    getList: '/web/subsidystandard/findSubsidystandard.htm',
    addData: '/web/subsidystandard/saveSubsidystandard.htm',
    updateData: '/web/subsidystandard/updSubsidystandard.htm',
    delData: '/web/subsidystandard/delSubsidystandard.htm',
    importData: '',
    getById: ''
  },
  areasubsidystandard: {
    getList: '/web/areasubsidystandard/findAreasubsidystandard.htm',
    addData: '/web/areasubsidystandard/saveAreasubsidystandard.htm',
    updateData: '/web/areasubsidystandard/updAreasubsidystandard.htm',
    delData: '/web/areasubsidystandard/delAreasubsidystandard.htm'
  },
  subsidystatistics: {
    getList: '/web/subsidystatistics/findSubsidystatistics.htm',
    getDetails: '/web/subsidydetailed/findSubsidydetailed.htm'
  },
  subsidyratio: {
    getList: '/web/subsidyratio/findSubsidyratio.htm',
    addData: '/web/subsidyratio/saveSubsidyratio.htm',
    updateData: '/web/subsidyratio/updSubsidyratio.htm',
    delData: '/web/subsidyratio/delSubsidyratio.htm'
  },
  areasubsidytarget: {
    getList: '/web/areasubsidytarget/findAreasubsidytarget.htm',
    addData: '/web/areasubsidytarget/saveAreasubsidytarget.htm',
    updateData: '/web/areasubsidytarget/updAreasubsidytarget.htm',
    delData: '/web/areasubsidytarget/delAreasubsidytarget.htm',
    getById: '/web/areasubsidytarget/findAreasubsidytargetById.htm',
    importData: '/web/areasubsidytarget/CityimportAreasubsidytarget.htm',
    importAreaData: '/web/areasubsidytarget/AreaimportAreasubsidytarget.htm',
    older: '/web/customer/findCustomerSelect.htm',
    mark: '/web/subsidystandard/findSubsidystandard.htm'
  },
  serviceprovider: {
    allList: '/web/serviceprovider/findSPAll.htm',
    getList: '/web/serviceprovider/findServiceprovider.htm',
    addData: '/web/serviceprovider/saveServiceprovider.htm',
    updateData: '/web/serviceprovider/updServiceprovider.htm',
    delData: '/web/serviceprovider/delServiceprovider.htm'
  },
  spassessment: {
    getList: '/web/spassessment/findSpassessment.htm',
    addData: '/web/spassessment/saveSpassessment.htm',
    updateData: '/web/spassessment/updSpassessment.htm',
    delData: '/web/spassessment/delSpassessment.htm'
  },
  serviceusers: {
    getList: '/web/serviceusers/findServiceusers.htm',
    addData: '/web/serviceusers/saveServiceusers.htm',
    updateData: '/web/serviceusers/updServiceusers.htm',
    delData: '/web/serviceusers/delServiceusers.htm'
  },
  spreconciliation: {
    accList: '/web/reconciliation/findReconciliation.htm',
    accById: '/web/workorder/findWorkorderlistByRetId.htm',
    getList: '/web/spreconciliation/findSpreconciliation.htm',
    addData: '/web/spreconciliation/saveSpreconciliation.htm',
    updateData: '/web/spreconciliation/updSpreconciliation.htm',
    delData: '/web/spreconciliation/delSpreconciliation.htm',
    detailList: '/web/spreconciliation/findSpnByIdList.htm'
  },
  serviceproject: {
    getList: '/web/serviceproject/findServiceproject.htm',
    addData: '/web/serviceproject/saveServiceproject.htm',
    updateData: '/web/serviceproject/updServiceproject.htm',
    delData: '/web/serviceproject/delServiceproject.htm'
  },
  servicestation: {
    getList: '/web/servicestation/findServicestation.htm',
    addData: '/web/servicestation/saveServicestation.htm',
    updateData: '/web/servicestation/updServicestation.htm',
    delData: '/web/servicestation/delServicestation.htm',
    getBySys: '/web/servicestation/findStBySys.htm'
  },
  helpelderly: {
    getList: '/web/helpelderly/findHelpelderly.htm',
    addData: '/web/helpelderly/saveHelpelderly.htm',
    updateData: '/web/helpelderly/updHelpelderly.htm',
    delData: '/web/helpelderly/delHelpelderly.htm'
  },
  cardorder: {
    cardList: '/web/workorder/findWorkorderBycard.htm',
    olderbycard: '/web/customer/findCustomerByOldcard.htm',
    addCard: '/web/workorder/addWorkorderBycard.htm'
  },
  workorder: {
    getList: '/web/workorder/findWorkorder.htm',
    addData: '/web/workorder/saveWorkorder.htm',
    updateData: '/web/workorder/updWorkorder.htm',
    delData: '/web/workorder/delWorkorder.htm',
    getById: '/web/workorder/findWorkorderById.htm',
    getByComId: '/web/workorder/findWorkorderlistByComId.htm',
    subList: '/web/customer/findCustomerSelect.htm',
    patchList: '/web/workorder/findSignInAndOut.htm',
    patch: '/web/workorder/updWDdispatch.htm',
    reform: '/web/workorder/updReassignment.htm',
    kfvisit: '/web/workorder/updWDVisitZd.htm',
    visit: '/web/workorder/updWDVisit.htm',
    callOff: '/web/workorder/updWDExit.htm',
    signIn: '/web/workorder/updWorkorderIn.htm',
    signOut: '/web/workorder/updWorkorderOut.htm',
    settle: '/web/workorder/updWDSettlement.htm',
    grade: '/web/workorder/findWDAppraise.htm'
  },
  orderrecord: {
    getList: '/web/orderrecord/findOrderrecord.htm',
    addData: '/web/orderrecord/saveOrderrecord.htm',
    updateData: '/web/orderrecord/updOrderrecord.htm',
    delData: '/web/orderrecord/delOrderrecord.htm',
    station: '/web/stationproject/findStationprojectBySpId.htm'
  },
  cuswallet: {
    getList: '/web/cuswallet/findCuswallet.htm',
    addData: '/web/cuswallet/saveCuswallet.htm',
    updateData: '/web/cuswallet/updCuswallet.htm',
    updData: '/web/cuswallet/updCuswalletCz.htm',
    delData: '/web/cuswallet/delCuswallet.htm',
    purList: '/web/cuswallethis/findCuswallethis.htm'
  },
  healthy: {
    getList: '/web/healthy/findHealthy.htm',
    addData: '/web/healthy/saveHealthy.htm',
    updateData: '/web/healthy/updateHealthy.htm',
    delData: '/web/healthy/delHealthy.htm',
    pressure: '/web/bloodpressure/findBloodpressure.htm',
    bloodsugar: '/web/bloodsugar/findBloodsugar.htm',
    bloodoxygen: '/web/bloodoxygen/findBloodoxygen.htm',
    heartrate: '/web/ecg/findEcg.htm'
  },
  guidance: {
    getList: '/web/guidance/findGuidance.htm',
    addData: '/web/guidance/saveGuidance.htm',
    updateData: '/web/guidance/updGuidance.htm',
    delData: '/web/guidance/delGuidance.htm'
  },
  newsinfo: {
    getList: '/web/newsinfo/findNewsinfo.htm',
    addData: '/web/newsinfo/saveNewsinfo.htm',
    updateData: '/web/newsinfo/updNewsinfo.htm',
    delData: '/web/newsinfo/delNewsinfo.htm'
  },
  relatives: {
    getList: '/web/relatives/findRelatives.htm',
    addData: '/web/relatives/saveRelatives.htm',
    updateData: '/web/relatives/updateRelatives.htm',
    delData: '/web/relatives/delRelatives.htm'
  },
  feedback: {
    getList: '/web/feedback/findFeedback.htm',
    addData: '/web/feedback/saveFeedback.htm',
    updateData: '/web/feedback/updFeedback.htm',
    delData: '/web/feedback/delFeedback.htm'
  },
  chronicdisease: {
    getList: '/web/chronicdisease/findChronicdisease.htm',
    addData: '/web/chronicdisease/saveChronicdisease.htm',
    updateData: '/web/chronicdisease/updChronicdisease.htm',
    delData: '/web/chronicdisease/delChronicdisease.htm'
  },
  addresstable: {
    getList: '/web/addresstable/findAddressTable.htm',
    getUserList: '/web/addresstable/findLowAddressTableById.htm',
    addData: '/web/addresstable/saveAddresstable.htm',
    updateData: '/web/addresstable/updAddressTable.htm',
    delData: '/web/addresstable/delAddresstable.htm'
  },
  expenditure: {
    getList: '/web/expenditure/findExpenditure.htm',
    addData: '/web/expenditure/saveExpenditure.htm',
    updateData: '/web/expenditure/updExpenditure.htm',
    delData: '/web/expenditure/delExpenditure.htm'
  },
  cusrecharge: {
    getList: '/web/cusrecharge/findCusrecharge.htm',
    delData: '/web/cusrecharge/delCusrecharge.htm'
  },
  materTrain: {
    getList: '/web/train/findTrain.htm',
    addData: '/web/train/saveTrain.htm',
    updateData: '/web/train/updateTrain.htm',
    delData: '/web/train/delTrain.htm'
  },
  materMeans: {
    getList: '/web/means/findMeans.htm',
    addData: '/web/means/saveMeans.htm',
    updateData: '/web/means/updateMeans.htm',
    delData: '/web/means/delMeans.htm'
  },
  usingHelp: {
    getList: '/web/usinghelp/findUsinghelp.htm',
    addData: '/web/usinghelp/saveUsinghelp.htm',
    updateData: '/web/usinghelp/updateUsinghelp.htm',
    delData: '/web/usinghelp/delUsinghelp.htm',
    getById: '/web/usinghelp/findUsinghelpById.htm'
  },
  collectionmag: {
    getList: '/web/collectionmag/findCollectionmag.htm',
    addData: '/web/collectionmag/saveCollectionmag.htm',
    updateData: '/web/collectionmag/updCollectionmag.htm',
    delData: '/web/Collectionmag/delCollectionmag.htm'
  },
  sys: {
    user: {
      getList: '/web/sysUser/findSysUser.htm',
      addData: '/web/sysUser/saveSysUser.htm',
      updateData: '/web/sysUser/upSysUser.htm',
      delData: '/web/sysUser/delSysUser.htm',
      resetWd: '/web/sysUser/resetPassWd.htm',
      modifyWd: '/web/sysUser/updPassWd.htm'
    },
    menu: {
      getList: '/web/sysMenu/findMenu.htm',
      addData: '/web/sysMenu/saveMenu.htm',
      updateData: '/web/sysMenu/upMenu.htm',
      delData: '/web/sysMenu/delMenu.htm'
    },
    button: {
      getList: '/web/button/findButton.htm',
      addData: '/web/button/saveButton.htm',
      updateData: '/web/button/upButton.htm',
      delData: '/web/button/delButton.htm'
    },
    role: {
      getList: '/web/sysRole/findRole.htm',
      addData: '/web/sysRole/saveRole.htm',
      updateData: '/web/sysRole/upRole.htm',
      delData: '/web/sysRole/delRole.htm'
    },
    dic: {
      getList: '/web/sysDict/findDict.htm',
      addData: '/web/sysDict/saveDict.htm',
      updateData: '/web/sysDict/upDict.htm',
      delData: '/web/sysDict/delDict.htm'
    }
  },
  large: {
    getBigScreenData: '/web/bigscreen/findBigscreen.htm'
  }
}
