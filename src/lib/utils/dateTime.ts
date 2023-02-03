import moment from 'moment';

export const formatDate = (date: moment.Moment | string, format = 'MMMM D, YYYY') =>
	date ? moment(date).format(format) : date;

export const formatDateTime = (date: moment.Moment | string, format = 'MMMM D, YYYY, h:mm A') =>
	date ? moment(date).format(format) : date;

export const formatDateTimeForAPI = (date: moment.Moment) =>
	date ? moment(date).utc().format() : date;

export const formatDateTimeConversational = (date: moment.Moment | Date | null) =>
	date ? moment(date).fromNow() : date;
