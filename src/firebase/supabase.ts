import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://bamkwivzlmivtgnedjfu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbWt3aXZ6bG1pdnRnbmVkamZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjQ1MjYsImV4cCI6MjA3NzkwMDUyNn0.fF7A7g3gNLrHCDxogV2hzumS4CBgPtUhtIjv_BbVBPI"
);
