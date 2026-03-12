import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Alert,
  Stack
} from "@mui/material";
import { useActionState, useState } from "react";
import supabase from "../supabase-client";

export default function SalesForm({ deals }) {
  const [mode, setMode] = useState("create");

  const [error, submitAction, isPending] = useActionState(
    async (prevState, formData) => {

      const dealName = formData.get("dealName");
      const value = formData.get("value");
      const dealId = formData.get("dealId");

      if (!value || Number(value) <= 0) {
        return "Please enter a valid value.";
      }

      // CREATE MODE
      if (mode === "create") {

        if (!dealName) {
          return "Deal name is required.";
        }

        const selectedDeal = deals.find((deal) => deal.id === Number(dealId));

        console.log("Selected deal:", selectedDeal);
        console.log(dealId);

        const { error } = await supabase
          .from("sales_deals")
          .insert({
            name: dealName,
            value: Number(value)
          });

        if (error) {
          console.error(error);
          return "Failed to add deal";
        }
      }

      // UPDATE MODE
      if (mode === "update") {

        if (!dealId) {
          return "Please select a deal to update.";
        }

        const { error } = await supabase
          .from("sales_deals")
          .update({
            value: Number(value)
          })
          .eq("id", dealId);

        if (error) {
          console.error(error);
          return "Failed to update deal";
        }
      }

      return null;
    },
    null
  );

  return (
    <Box
      component="form"
      action={submitAction}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        width: { xs: "100%", sm: 400, md: 500 }
      }}
    >

      <h2 className="text-2xl font-semibold text-center">
        Sales Deals
      </h2>

      {error && <Alert severity="error">{error}</Alert>}

      {/* Mode Switch */}
      <Stack direction="row" spacing={2}>
        <Button
          variant={mode === "create" ? "contained" : "outlined"}
          fullWidth
          onClick={() => setMode("create")}
        >
          Create
        </Button>

        <Button
          variant={mode === "update" ? "contained" : "outlined"}
          fullWidth
          onClick={() => setMode("update")}
        >
          Update
        </Button>
      </Stack>

      {mode === "create" && (
        <TextField
          name="dealName"
          label="Deal Name"
          fullWidth
        />
      )}

      {/* Update Mode */}
      {mode === "update" && (
        <FormControl fullWidth>
          <InputLabel>Select Deal</InputLabel>
          <Select name="dealId" label="Select Deal" defaultValue="">
            {deals.map((deal) => (
              <MenuItem key={deal.id} value={deal.id}>
                {deal.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <TextField
        name="value"
        label="Value"
        type="number"
        fullWidth
        required
        InputProps={{ inputProps: { min: 0 } }}
      />

      {/* <FormControl fullWidth>
        <InputLabel id="select-deal-label">
          Select Existing Deal
        </InputLabel>

        <Select
          labelId="select-deal-label"
          name="selectedDeal"
          label="Select Existing Deal"
          defaultValue=""
        >
          {deals.map((deal) => (
            <MenuItem key={deal.id} value={deal.name}>
              {deal.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isPending}
        sx={{ height: 56 }}
      >
        {isPending ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Submit Deal"
        )}
      </Button>
    </Box>
  );
}