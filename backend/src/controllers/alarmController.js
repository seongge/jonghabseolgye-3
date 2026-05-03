const mongoose = require("mongoose");
const Alarm = require("../models/Alarm");

const formatAlarm = (alarm) => ({
  alarm_id: alarm._id,
  user_id: alarm.user_id,
  alarm_type: alarm.alarm_type,
  notice_id: alarm.notice_id,
  comment_id: alarm.comment_id,
  post_id: alarm.post_id,
  alarm_body: alarm.alarm_body,
  created_at: alarm.created_at,
});

const getAlarmUniqueKey = (alarm) => {
  if (alarm.alarm_type === "notice" && alarm.notice_id) {
    return `notice:${String(alarm.notice_id)}`;
  }

  if (alarm.alarm_type === "comment" && alarm.comment_id) {
    return `comment:${String(alarm.comment_id)}`;
  }

  return `${alarm.alarm_type}:${String(alarm.post_id || "")}:${alarm.alarm_body}`;
};

const removeDuplicateAlarms = async (alarms, userId) => {
  const seen = new Set();
  const uniqueAlarms = [];
  const duplicateIds = [];

  alarms.forEach((alarm) => {
    const key = getAlarmUniqueKey(alarm);
    if (seen.has(key)) {
      duplicateIds.push(alarm._id);
      return;
    }

    seen.add(key);
    uniqueAlarms.push(alarm);
  });

  if (duplicateIds.length > 0) {
    await Alarm.deleteMany({
      _id: { $in: duplicateIds },
      user_id: userId,
    });
  }

  return uniqueAlarms;
};

const getMyAlarms = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const alarms = await Alarm.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();

    const uniqueAlarms = await removeDuplicateAlarms(alarms, userId);

    return res.status(200).json({
      success: true,
      message: "알림 목록 조회 성공",
      count: uniqueAlarms.length,
      data: uniqueAlarms.map(formatAlarm),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "알림 목록 조회 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

const deleteMyAlarm = async (req, res) => {
  try {
    const { alarmId } = req.params;
    const userId = req.user.user_id;

    if (!mongoose.Types.ObjectId.isValid(alarmId)) {
      return res.status(400).json({
        success: false,
        message: "올바르지 않은 알림 ID입니다.",
      });
    }

    const deletedAlarm = await Alarm.findOneAndDelete({
      _id: alarmId,
      user_id: userId,
    }).lean();

    if (!deletedAlarm) {
      return res.status(404).json({
        success: false,
        message: "삭제할 알림이 없거나 본인의 알림이 아닙니다.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "알림 확인 처리 및 삭제 성공",
      data: formatAlarm(deletedAlarm),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "알림 삭제 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyAlarms,
  deleteMyAlarm,
};
