import React, { useContext, useState } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonPage, useIonViewWillEnter, useIonViewDidLeave, IonItem, IonLabel, IonList } from '@ionic/react';

import { ActionCard, UserInfoCard } from '../components';
import { Auth } from '../services/AuthService';
import { AuthActions, AuthActionBuilder, AuthObserver } from 'ionic-appauth';
import { RouteComponentProps } from 'react-router';
import { ApiService } from '../services/ApiService';
import { ActionType, AppContext } from '../services/State';

interface HomePageProps extends RouteComponentProps {}

const Home : React.FC<HomePageProps> = (props: HomePageProps) => {

    const [action, setAction] = useState(AuthActionBuilder.Default);
    const [user, setUser] = useState();
    const { state, dispatch } = useContext(AppContext);
    let observer: AuthObserver;

    useIonViewWillEnter(() => {
        observer = Auth.Instance.addActionListener((action) => {
            setAction(action);
            if(action.action === AuthActions.SignOutSuccess){
                props.history.replace('landing');
            }

            if(action.action === AuthActions.LoadUserInfoSuccess){
                setUser(action.user);
            }
        });
    });

    useIonViewDidLeave(() => {
        Auth.Instance.removeActionObserver(observer);
    });
    
    function handleSignOut(e : any) {
        e.preventDefault();
        Auth.Instance.signOut();
    }

    function handleRefresh(e : any) {
        e.preventDefault();
        Auth.Instance.refreshToken();
    }

    function handleGetUserDetails(e : any) {
        e.preventDefault();
        Auth.Instance.loadUserInfo();

        new ApiService().getUsers().then(res => {
            dispatch({
              type: ActionType.SET_USERS,
              users: res
            })
        })
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Logged In</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={handleGetUserDetails}>Get User Details</IonButton>
                <IonButton onClick={handleRefresh}>Refresh Token</IonButton>
                <IonButton onClick={handleSignOut}>Sign Out</IonButton>
                <ActionCard action={action}></ActionCard>
                {user && <UserInfoCard user={user}></UserInfoCard>}
                <IonList>
                    {state.users.map((auser: any) => (
                    <IonItem key={auser.id}>
                        <IonLabel>
                            {auser.name}
                        </IonLabel>
                    </IonItem>
                    )) }
                </IonList>
            </IonContent>
        </IonPage>
    ); 
};

export default Home;
