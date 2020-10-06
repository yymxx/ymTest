export const allApi = {
  getByTel: '/web/HuJiao/findHuJiaoByTelephone.htm',
  allRecord: '/web/HuJiao/findWorkorderRecord.htm',
  statis: '/web/seatsStatistical/findSeatsStatistical.htm',
  statisByTime: '/web/seatsStatistical/findSeatsStatisticalByTime.htm',
  callmanage: {
    callIn: '/web/callmanage/findCallmanage.htm',
    callOut: '/web/calloutmanage/findCalloutmanage.htm',
    addCallIn: '/web/callmanage/addCallmanage.htm',
    addCallOut: '/web/calloutmanage/addCalloutmanage.htm',
    getInById: '/web/callmanage/findCallmanageDetails.htm',
    getOutById: '/web/calloutmanage/findCalloutmanageById.htm'
  },
  zuoxiRecord: {
    getList: '/web/zuoxiRecord/findZuoxiRecord.htm',
    addData: 'web/zuoxiRecord/saveZuoxiRecord.htm',
    updateData: '/web/zuoxiRecord/updateZuoxiRecord.htm',
    delData: '/web/zuoxiRecord/delZuoxiRecord.htm'
  },
  warning: {
    getList: '/web/warning/findWarning.htm',
    updateData: '/web/warning/updateWarning.htm',
    getById: '/web/warning/findWarningById.htm'
  },
  plan: {
    getList: '/web/taskplan/findTaskplan.htm',
    addData: '/web/taskplan/saveTaskplan.htm',
    updateData: '/web/taskplan/updateTaskplan.htm',
    delData: '/web/taskplan/delTaskplan.htm',
    getById: '/web/taskplan/findTaskplanById.htm'
  },
  black: {
    getList: '/web/blacklist/findBlacklist.htm',
    addData: '/web/blacklist/saveBlacklist.htm',
    updateData: '/web/blacklist/updateBlacklist.htm',
    delData: '/web/blacklist/delBlacklist.htm'
  },
  complaint: {
    getList: '/web/complaint/findComplaint.htm',
    getById: '/web/complaint/findComplaintById.htm',
    updateData: '/web/complaint/updateComplaint.htm'
  },
  election: {
    older: '/web/customer/findCustomer.htm',
    seat: '/web/zuoxiRecord/findZuoxiRecord.htm'
  },
  callcenter: '/web/HuJiao/findHujiaoHomepage.htm'
}
