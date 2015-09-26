/**
 * Created by BennetWang on 2015/9/21.
 */
import baseI18n from './base.js';
import scheduleI18n from './schedule.js'
import taskI18n from './task.js'
import approveI18n from './approve.js'

let key='zh';

export default i18n={
    "base":baseI18n[key],
    "schedule":scheduleI18n[key],
    "task":taskI18n[key],
    "approve":approveI18n[key]
}

export const base=baseI18n[key];
export const schedule=scheduleI18n[key];
export const task=taskI18n[key];
export const approve=approveI18n[key];

