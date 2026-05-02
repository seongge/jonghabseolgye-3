const Alarm = require("../models/Alarm");
const User = require("../models/User");

const NOTICE_ALARM_BODY = "새로운 공지가 올라왔습니다.";

function buildStudentFilterForNotice(notice) {
  const filter = {
    $or: [{ role: "student" }, { role: { $exists: false } }],
  };

  if (notice.notice_scope === "department") {
    if (!notice.department) return null;
    filter.major = notice.department;
  }

  return filter;
}

async function createNoticeAlarms(notice) {
  if (!notice || !notice._id) {
    return { targetUserCount: 0, createdAlarmCount: 0 };
  }

  const userFilter = buildStudentFilterForNotice(notice);
  if (!userFilter) {
    return { targetUserCount: 0, createdAlarmCount: 0 };
  }

  const users = await User.find(userFilter).select("_id").lean();

  if (users.length === 0) {
    return { targetUserCount: 0, createdAlarmCount: 0 };
  }

  const now = new Date();
  const alarms = users.map((user) => ({
    user_id: user._id,
    alarm_type: "notice",
    notice_id: notice._id,
    comment_id: null,
    post_id: null,
    alarm_body: NOTICE_ALARM_BODY,
    created_at: now,
  }));

  const result = await Alarm.insertMany(alarms, { ordered: false });

  return {
    targetUserCount: users.length,
    createdAlarmCount: result.length,
  };
}

module.exports = {
  NOTICE_ALARM_BODY,
  createNoticeAlarms,
};
