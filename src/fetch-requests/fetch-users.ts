import axios from "axios";

export interface FetchedUser {
  login: string;
  code: string;
  name: string;
  surname: string;
  completedLevels: string[];
  additionalInfo: string;
}

const fetchUsers = async (postData?: any): Promise<FetchedUser[]> => {
  const { data } = await axios({
    method: "post",
    url: postData
      ? "https://mathhelper.space:8443/api/activity_log/find_win_log"
      : "https://mathhelper.space:8443/api/activity_log/win_log_all ",
    data: postData || {},
  });
  const fetchedUsers: FetchedUser[] = [];
  data.forEach((log: any) => {
    const userIndex = fetchedUsers.findIndex(
      (user) => user.login === log.user_login
    );
    if (userIndex === -1) {
      fetchedUsers.push({
        login: log.user_login,
        code: log.user_code,
        name: log.user_name,
        surname: log.user_username,
        completedLevels: [log.level_name],
        additionalInfo: log.user_add_info,
      });
    } else {
      const user = fetchedUsers[userIndex];
      if (!user.completedLevels.find((level) => level === log.level_name)) {
        user.completedLevels.push(log.level_name);
      }
    }
  });
  return new Promise<FetchedUser[]>((resolve) => resolve(fetchedUsers));
};

export default fetchUsers;