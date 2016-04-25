using System;
using System.Net.Sockets;
using System.Net;
using System.IO.Ports;
using System.Diagnostics;

class PortDataReceived
{
    public static void Main()
    {
        SerialPort mySerialPort = new SerialPort("COM3");

        mySerialPort.BaudRate = 38400;
        mySerialPort.Parity = Parity.None;
        mySerialPort.StopBits = StopBits.One;
        mySerialPort.DataBits = 8;
        mySerialPort.Handshake = Handshake.None;
        mySerialPort.RtsEnable = true;
		
		TcpListener server = new TcpListener(IPAddress.Parse("127.0.0.1"), 80);
		server.Start();
        Console.WriteLine("Server has started on 127.0.0.1:80.{0}Waiting for a connection...", Environment.NewLine);

        TcpClient client = server.AcceptTcpClient();

        Console.WriteLine("A client connected.");

        mySerialPort.DataReceived += new SerialDataReceivedEventHandler(DataReceivedHandler);
		
        mySerialPort.Open();

        Console.WriteLine("Press any key to continue...");
        Console.WriteLine();
        Console.ReadKey();
        mySerialPort.Close();
    }

    private static void DataReceivedHandler(
                        object sender,
                        SerialDataReceivedEventArgs e)
    {
        SerialPort sp = (SerialPort)sender;
        //string indata = sp.ReadExisting();
		Console.WriteLine("Data Received:");
		Console.WriteLine(DateTime.Now);
		string indata = sp.ReadTo("]");
					
			
			string[] splittedData = indata.Split(',');
			string temperature = "";
			string firstTemperatureHistory = "";
			string secondTemperatureHistory = "";
			
			string humidity = "";
			string firstHumidityHistory = "";
			string secondHumidityHistory = "";
			
			string airPressure = "";

			foreach(string values in splittedData){
				
				if(values.Contains("te=")){
					temperature = values.Split('=')[1];
					
				}
				
			    else if(values.Contains("te1=")){
					firstTemperatureHistory = values.Split('=')[1];
					
				}
				
				else if(values.Contains("te2=")){
					secondTemperatureHistory = values.Split('=')[1];
					
				}
				
				else if(values.Contains("hu=")){
					humidity = values.Split('=')[1];
					
				}
				else if(values.Contains("hu1=")){
					firstHumidityHistory = values.Split('=')[1];
					
				}
				else if(values.Contains("hu2=")){
					secondHumidityHistory = values.Split('=')[1];
					
				}
				else if(values.Contains("pa=")){
					airPressure = values.Split('=')[1];
					
				}
				
			}
			Console.WriteLine("real temp: " + temperature + " ... firstTempHistory: " + firstTemperatureHistory + " ... secondTempHistory: " + secondTemperatureHistory + " ... real humidity: " + humidity + " ... firstHumidHistory: " + firstHumidityHistory +" ... secoHumidHistory: " + secondHumidityHistory + " ... " + airPressure);
		//}
		
        Console.WriteLine(indata);
    }
}