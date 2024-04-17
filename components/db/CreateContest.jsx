import { v4 as uuidv4 } from "uuid";
import supabase from ".";

export const CreateContest = async ({ title, endTimestamp, background }) => {
  const contest_id = uuidv4();

  try {
    const fileExtension = background.name.split(".").pop();

    const { data, error } = await supabase.storage
      .from("background")
      .upload(`${contest_id}.${fileExtension}`, background);

    if (error) {
      throw error;
    }

    const { data: contestData, error: contestError } = await supabase
      .from("contest")
      .insert([
        {
          contest_id,
          title,
          end_timestamp: endTimestamp,
          background: `${contest_id}.${fileExtension}`,
        },
      ]);

    if (contestError) {
      throw contestError;
    }

    return {
      status: true,
      contest_id: contest_id,
    };
    return true;
  } catch (error) {
    console.error("Error creating contest:", error.message);
    return {
      status: false,
    };
  }
};
