export type {
  AgenciesResponse,
  Agency,
  Notice,
  NoticesResponse,
  SubscribeRequest,
  SubscribeResponse,
} from "./types/api";

export type NoticeFilters = {
  agency_slug: string;
  document_type: string;
  actionability: string;
  deadline_status: string;
};
