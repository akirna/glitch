'''
Maria Cioffi, Cole Conte, Andrew Kirna
httpserver.py
Last Edited: Mon Nov 16 2015
Revised from a sample Python Server from Xiannong Meng,
which was in turn revised from the code segments:
http://stackoverflow.com/questions/23264569/python-3-x-basehttpserver-or-http-server
and
https://wiki.python.org/moin/BaseHttpServer#Official_Documentation
'''

from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib
import requests
import time
import os
from os.path import isfile, join
import operator

#HOST_NAME = "localhost"
HOST_NAME = "brki164-lnx-19"  # any real host name where the server is running
HOST_PORT = 9000
server_name = "Python Server"
imgVidAudExtensions=[".png",".jpeg",".jpg",".tiff",".gif",".bmp",".svg",".mp4",\
                        ".flv",".ogg",".gifv",".mov",".qt",".wmv",".m4p",".m4v",\
                        ".mpg",".mp2",".mpeg",".mp3",".wav",".wma",".m4a"]

class MyServer(BaseHTTPRequestHandler):
    """
    def __init__(self, server_name, port=HOST_PORT):
        
        self.server_name = sever_name
        self.port = port
    """
    


    def do_HEAD(self):
        '''sends headers'''
        self.send_response(200)
        self.send_header("Server", server_name)
        self.send_header("Content-Type", "text")
        self.send_header("Access-Control-Allow-Origin","*")
        self.end_headers()
    
    def do_GET(self):
        '''handles GET requests to the server'''
        fileList=self.getFiveMostRecentFiles()
        self.do_HEAD()
        for x in fileList:
                self.wfile.write((x[0]).encode("utf-8"))
                self.wfile.write(("\n").encode("utf-8"))
    
    def getFiveMostRecentFiles(self):
        '''returns a list of the five most recently edited files in the current directory.
        does not return media files, backup files, and the server itself.'''
        mypath=os.getcwd()
        fileList=self.getFiles(mypath)
        newFList = [x for x in fileList if isfile(x)]

        info={}
        for x in newFList:
            fd = os.open(x, os.O_RDWR|os.O_CREAT )
            fName=x.replace(str(mypath)+"/",'')
            fileInfo= os.fstat(fd)
            info[fName]=fileInfo[8]
        sortedFiles = sorted(info.items(), key=operator.itemgetter(1),reverse=True)
        fileList = []
        for x in sortedFiles:
            #prevents writing into backup files, the server, chrome extension files, and media files
            if("~" != x[0][-1] and x[0] != "httpserver.py" and x[0][-4:] not in imgVidAudExtensions and "chrome_sample" not in x[0]):
                fileList +=[x]
        if len(fileList)>5:
            fileList= fileList[:5]
        return fileList

    def getFiles(self,path):
        fileList=[]
        fList=[f for f in os.listdir(path) if not f[0] == '.']
        for d in fList:
            abs_d = os.path.join(path, d)
            if os.path.isdir(abs_d) and abs_d[0]!=".":
                fileList+=self.getFiles(abs_d)
            if os.path.isfile(abs_d) and abs_d[0]!=" ":
                fileList+=[abs_d]
        for x in fileList:
            print(x)
            print()
        return fileList

    def do_POST(self):
        '''handles POST requests to the server'''
        length = int(self.headers['Content-Length'])
        post_data = urllib.parse.parse_qs(self.rfile.read(length).decode('utf-8'))
        # You now have a dictionary of the post data
        for k in post_data:
            if post_data[k][0][-4:] in imgVidAudExtensions:
                self.downloadMediaFile(post_data[k][0])
            else:
                self.saveTextToFile(k,post_data[k])

    def downloadMediaFile(self,url):
        '''downloads a media file to the current directory.
        the media file will be named what is named on the web
        (the back end of its URL)'''
        #gets the name of the file
        fileName=""
        i=-1
        while(url[i]!="/"):
            fileName+=url[i]
            i-=1
        #reverse fileName
        fileName=fileName[::-1]
        #if the name already exists, add a number to the end
        if(os.path.isfile(fileName)):
            num=1
            fileName=fileName[:-4]+str(num)+fileName[-4:]
        while(os.path.isfile(fileName)):
            num+=1
            fileName=fileName[:-5]+str(num)+fileName[-4:]
        r = requests.get(url, stream=True)
        with open(fileName, 'wb') as f:
            print("Downloading...")
            for chunk in r.iter_content(chunk_size=1024): 
                if chunk:
                    f.write(chunk)
            print("Complete")
            print("Downloaded new media file into " + fileName)

    def saveTextToFile(self,file,text):
        '''writes text to a file. Existing files will be appended to.'''
        exists = os.path.isfile(file)
        if exists:
            f=open(str(file),"a")
        else:
            f=open(str(file),"w")
        f.write(str(text))
        f.close()
        if exists:
            print("Appended to existing file " + file)
        else:
            print("Wrote to new file " + file)

        
            
if __name__ == '__main__':

    httpd = HTTPServer((HOST_NAME, HOST_PORT), MyServer)
    print(time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, HOST_PORT))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()
        print()
        print(time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, HOST_PORT))
