import React, { useEffect } from "react";
import translate from "../../translations/translate";
// redux
import { connect, MapDispatchToProps } from "react-redux";
import { createStructuredSelector } from "reselect";
import {
  selectIsAllUserTabsFetched,
  selectIsUserTabsFetching,
  selectUserTabsCurrentPage,
  selectUserTabsError,
  selectUserTabsList,
  selectUserTabsPageSize,
  selectUserTabsSortedBy,
  selectUserTabsSortedDescending,
} from "../../redux/user-tabs/user-tabs.selectors";
import { fetchUserTabsStartAsync } from "../../redux/user-tabs/user-tabs.actions";
// components
import AppTabHeader from "../../components/app-tab-header/app-tab-header";
import AppTabsList from "../../components/app-tabs-list/app-tabs-list";
import InfiniteScroll from "react-infinite-scroller";
import AppSpinner from "../../components/app-spinner/app-spinner";
// types
import { AppTabProps } from "../../components/app-tab/app-tab";
import { AppTabType } from "../../types/app-tabs/AppTab";
import {
  FetchUsersRequestData,
  UsersSortingProperty,
} from "../../redux/user-tabs/user-tabs.types";
// data
import HEADER_TABS_STATE from "../../redux/header-tabs/header-tabs.state";
// styles
import "./users-page.scss";
import FetchErrorMessage from "../../components/fetch-error-message/fetch-error-message";

interface UsersPageProps {
  // redux props
  isUserTabsFetching: boolean;
  userTabs: AppTabProps[] | null;
  fetchUserTabsStartAsync: (data: FetchUsersRequestData) => AppTabProps[];
  usersTabsSortedBy: UsersSortingProperty;
  usersSortedByDescending: boolean;
  userTabsPageSize: number;
  userTabsCurrentPage: number;
  isAllUserTabsFetched: boolean;
  userTabsError: any;
}

const UsersPage: React.FC<UsersPageProps> = ({
  isUserTabsFetching,
  userTabs,
  fetchUserTabsStartAsync,
  usersTabsSortedBy,
  usersSortedByDescending,
  userTabsPageSize,
  userTabsCurrentPage,
  isAllUserTabsFetched,
  userTabsError,
}) => {
  // translation vars
  const translationPrefix: string = "playersPage";
  const titleId: string = translationPrefix + ".title";

  useEffect(() => {
    fetchUserTabsStartAsync({
      gameCode: null,
      levelCode: null,
      sortedBy: UsersSortingProperty.BY_RATING,
      descending: true,
      offset: 0,
      limit: userTabsPageSize,
    });
  }, []);

  const nextPage = () => {
    if (!isUserTabsFetching) {
      fetchUserTabsStartAsync({
        levelCode: null,
        gameCode: null,
        sortedBy: usersTabsSortedBy,
        descending: usersSortedByDescending,
        offset: userTabsCurrentPage * userTabsPageSize,
        limit: userTabsPageSize,
      });
    }
  };

  return (
    <div className="players-page u-container">
      <h1 className="u-mb-sm">{translate(titleId)}</h1>
      <AppTabHeader
        type={AppTabType.USER}
        fields={HEADER_TABS_STATE[AppTabType.USER]}
      />
      {userTabs ? (
        <InfiniteScroll
          loadMore={() => {
            nextPage();
          }}
          hasMore={!isAllUserTabsFetched}
          loader={<AppSpinner loading={true} />}
        >
          <AppTabsList tabs={userTabs} />
        </InfiniteScroll>
      ) : userTabsError ? (
        <FetchErrorMessage serverError={userTabsError} />
      ) : (
        <AppSpinner loading={true} />
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector<any, any>({
  isUserTabsFetching: selectIsUserTabsFetching,
  userTabs: selectUserTabsList,
  usersTabsSortedBy: selectUserTabsSortedBy,
  usersSortedByDescending: selectUserTabsSortedDescending,
  userTabsPageSize: selectUserTabsPageSize,
  userTabsCurrentPage: selectUserTabsCurrentPage,
  isAllUserTabsFetched: selectIsAllUserTabsFetched,
  userTabsError: selectUserTabsError,
});

const mapDispatchToProps: MapDispatchToProps<any, any> = (dispatch: any) => ({
  fetchUserTabsStartAsync: (data: FetchUsersRequestData) =>
    dispatch(fetchUserTabsStartAsync(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);
