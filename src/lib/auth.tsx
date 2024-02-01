import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import {
  AuthChangeEvent,
  AuthError,
  AuthResponse,
  OAuthResponse,
  User,
  UserResponse,
} from "@supabase/supabase-js";
import { useUser } from "@clerk/nextjs";
import { supabase } from "./supabase";

export const AuthContext = React.createContext({});

export const AuthContextProvider = ({ children }: any) => {
  let { user } = useUser();
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = useState({});
  console.log(user);
  user = { ...user, ...userData };
  React.useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user?.id);
      if (data) {
        user.update({ unsafeMetadata: data[0] });

        setLoading(false);
      }

      if (data) {
        console.log(data);
      }
    };
    fetchData();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
